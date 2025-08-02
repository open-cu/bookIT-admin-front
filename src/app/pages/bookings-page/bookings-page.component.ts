import {Component, inject} from '@angular/core';
import {FilterResult} from '../../shared/common-ui/filter-block/filter-config';
import {CreationConfig, markAsRequired} from '../../shared/common-ui/creation-block/creation-config';
import {TablePageComponent} from '../../shared/common-ui/table-page/table-page.component';
import {Booking} from '../../core/models/interfaces/bookings/booking';
import {
  BOOKINGS_COLUMNS_CONFIG,
  BOOKINGS_CREATION_CONFIG,
  BOOKINGS_DELETION_CONFIG,
  BOOKINGS_EDITION_CONFIG,
  BOOKINGS_FILTER_OPTIONS
} from './bookings.config';
import {SortBooking} from '../../core/models/interfaces/bookings/sort-booking';
import {BookingService} from '../../core/services/api/booking.service';
import {CreateBooking} from '../../core/models/interfaces/bookings/create-booking';
import {UpdateBooking} from '../../core/models/interfaces/bookings/update-booking';
import {UserService} from '../../core/services/api/auth/user.service';
import {AreaService} from '../../core/services/api/area.service';
import {map} from 'rxjs';

@Component({
  selector: 'app-bookings-page',
  imports: [
    TablePageComponent
  ],
  templateUrl: './bookings-page.component.html',
  styleUrl: './bookings-page.component.css'
})
export class BookingsPageComponent extends TablePageComponent<Booking> {
  override filterResult: FilterResult<typeof this.filterOptions> = {};
  override filterOptions = BOOKINGS_FILTER_OPTIONS;
  override columns = BOOKINGS_COLUMNS_CONFIG;
  override creationConfig = BOOKINGS_CREATION_CONFIG
  override editionConfig = BOOKINGS_EDITION_CONFIG;
  override deletionConfig = BOOKINGS_DELETION_CONFIG;

  private bookingService = inject(BookingService);
  private areaService = inject(AreaService);
  private userService = inject(UserService);

  constructor() {
    super();
    markAsRequired(this.creationConfig);
    this.userService.getMe()
      .subscribe(me => this.creationConfig.options[0].value = me.id);
    this.areaService.getList().pipe(
      map(res => res.content)
    ).subscribe(
      areas => {
        areas.forEach(area => {
          let option = {value: area.id, label: area.name,};
          this.filterOptions[1].options!.push(option);
          this.creationConfig.options[1].options!.push(option);
          this.editionConfig.options[0].options!.push(option);
        })
      }
    );
  }

  override loadItemsFn = (params: Partial<SortBooking>) => {
    return this.bookingService.getList(params);
  }

  override createItemFn = (item: CreateBooking) => {
    return this.bookingService.post(item);
  }

  override deleteItemFn = (item: Booking) => {
    return this.bookingService.delete(item.id);
  }

  override editItemFn = (item: any, update: UpdateBooking) => {
    return this.bookingService.put(item['id'], update);
  }

  override transformParamsFn = (params: any) => {
    return this.parseTimeIntervals(params);
  }

  override transformPatchFn = (config: CreationConfig, item: any) => {
    return {
      ...config,
      intervals: [],
      date: new Date(item.startTime)
    };
  }

  private parseTimeIntervals = (params: any) => {
    const {intervals: periods, date, ...result} = params;
    if (!periods) {
      return params;
    }
    let intervals = (periods as string[])
      .map(period => period.split(';'))
      .map(period => ({first: period[0], second: period[1]}));
    return {...result, timePeriods: intervals};
  }
}
