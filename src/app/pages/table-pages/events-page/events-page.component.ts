import {Component, inject} from '@angular/core';
import {TablePageComponent} from '../../../shared/common-ui/table-page/table-page.component';
import {Event} from '../../../core/models/interfaces/events/event';
import {CreationConfig, markAsRequired} from '../../../shared/common-ui/creation-block/creation-config';
import {
  CreateEventParams,
  EVENTS_COLUMNS_CONFIG,
  EVENTS_CREATION_CONFIG,
  EVENTS_DELETION_CONFIG,
  EVENTS_EDITION_CONFIG,
  EVENTS_FILTER_OPTIONS,
  UpdateEventParams
} from './events.config';
import {SortEvent} from '../../../core/models/interfaces/events/sort-event';
import {EventService} from '../../../core/services/api/event.service';
import {DatePipe} from '@angular/common';
import {findIndexByKey, patchItemWithImages, patchItemWithTime} from '../common-functions';

@Component({
  selector: 'app-events-page',
  imports: [
    TablePageComponent
  ],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css'
})
export class EventsPageComponent extends TablePageComponent<Event> {
  override filterOptions = EVENTS_FILTER_OPTIONS;
  override columns = EVENTS_COLUMNS_CONFIG;
  override creationConfig = EVENTS_CREATION_CONFIG
  override editionConfig = EVENTS_EDITION_CONFIG;
  override deletionConfig = EVENTS_DELETION_CONFIG;

  private eventService = inject(EventService);
  private datePipe = inject(DatePipe);

  constructor() {
    super();
    const excludes = ['tags', 'formats', 'times', 'participationFormats'];
    markAsRequired(this.creationConfig, excludes);
    markAsRequired(this.creationConfig, excludes);
  }

  override loadItemsFn = (params: SortEvent) => {
    params.sort = 'startTime,des';
    return this.eventService.getList(params);
  }

  override createItemFn = (item: CreateEventParams) => {
    const { photos, date, intervals, ...event } = item;
    const startTime = intervals[0].split(';')[0];
    const endTime = intervals[intervals.length - 1].split(';')[1];
    return this.eventService.post({
      updateEventRequest: {
        startTime,
        endTime,
        ...event,
      },
      photos
    });
  }

  override deleteItemFn = (item: Event) => {
    return this.eventService.delete(item.id);
  }

  override editItemFn = (item: Event, update: UpdateEventParams) => {
    const {date, startTime, endTime, photos, ...result} = update;
    const dates = [startTime, endTime]
      .map(time => {
        const res = new Date(date);
        res.setHours(time.hours, time.minutes);
        return res;
      })
      .map(date => this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS')! + 'Z');
    return this.eventService.put(item.id, {
      updateEventRequest: {
        ...result,
        startTime: dates[0],
        endTime: dates[1]
      },
      photos
    });
  }

  override transformPatchFn = (config: CreationConfig, item: Event) => {
    let placesIndex = findIndexByKey(config, 'available_places');
    config.options[placesIndex].value = item.availablePlaces;
    config = patchItemWithImages(config, item);
    return patchItemWithTime(config, item);
  }
}
