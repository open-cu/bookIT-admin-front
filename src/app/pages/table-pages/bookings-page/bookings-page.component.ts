import {Component, inject} from '@angular/core';
import {CreationConfig, markAsRequired} from '../../../shared/common-ui/creation-block/creation-config';
import {TablePageComponent} from '../../../shared/common-ui/table-page/table-page.component';
import {Booking} from '../../../core/models/interfaces/bookings/booking';
import {
  BookingCreationItem,
  BOOKINGS_COLUMNS_CONFIG,
  BOOKINGS_CREATION_CONFIG,
  BOOKINGS_DELETION_CONFIG,
  BOOKINGS_EDITION_CONFIG,
  BOOKINGS_FILTER_OPTIONS,
  BookingUpdateItem
} from './bookings.config';
import {SortBooking} from '../../../core/models/interfaces/bookings/sort-booking';
import {BookingService} from '../../../core/services/api/booking.service';
import {AreaService} from '../../../core/services/api/area.service';
import {map} from 'rxjs';
import {DatePipe} from '@angular/common';
import {patchItemWithTime} from '../common-functions';

@Component({
  selector: 'app-bookings-page',
  imports: [
    TablePageComponent
  ],
  templateUrl: './bookings-page.component.html',
  styleUrl: './bookings-page.component.css'
})
export class BookingsPageComponent extends TablePageComponent<Booking> {
  override filterOptions = BOOKINGS_FILTER_OPTIONS;
  override columns = BOOKINGS_COLUMNS_CONFIG;
  override creationConfig = BOOKINGS_CREATION_CONFIG
  override editionConfig = BOOKINGS_EDITION_CONFIG;
  override deletionConfig = BOOKINGS_DELETION_CONFIG;

  private bookingService = inject(BookingService);
  private areaService = inject(AreaService);
  private datePipe = inject(DatePipe);

  constructor() {
    super();
    markAsRequired(this.creationConfig);
    markAsRequired(this.editionConfig);
    this.areaService.getList().pipe(
      map(res => res.content)
    ).subscribe(
      areas => {
        this.filterOptions[1].options = [];
        areas.forEach(area => {
          let option = {value: area.id, label: area.name,};
          this.filterOptions[1].options!.push(option);
        })
      }
    );
  }

  override loadItemsFn = (params: SortBooking) => {
    return this.bookingService.getList(params);
  }

  override createItemFn = (item: BookingCreationItem) => {
    const {intervals: periods, date, ...result} = item;
    let intervals = (periods as string[])
      .map(period => period.split(';'))
      .map(period => ({first: period[0], second: period[1]}));
    return this.bookingService.post({
      ...result,
      timePeriods: intervals
    });
  }

  override deleteItemFn = (item: Booking) => {
    return this.bookingService.delete(item.id);
  }

  override editItemFn = (item: Booking, update: BookingUpdateItem) => {
    const {date, startTime, endTime, ...result} = update;
    const dates = [startTime, endTime]
      .map(time => {
        const res = new Date(date);
        res.setHours(time.hours, time.minutes);
        return res;
      })
      .map(date => this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS')! + 'Z');
    return this.bookingService.put(item.id, {
      ...result,
      userId: item.userId,
      startTime: dates[0],
      endTime: dates[1],
    });
  }

  override transformPatchFn = (config: CreationConfig, item: Booking) => {
    return patchItemWithTime(config, item);
  }
}
