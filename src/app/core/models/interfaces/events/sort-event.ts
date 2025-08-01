import {ThemeTag} from '../../enums/theme-tag';
import {EventFormat} from '../../enums/events/event-format';
import {EventTime} from '../../enums/events/event-time';
import {EventParticipationFormat} from '../../enums/events/event-participation-format';
import {SortPage} from '../pagination/sort-page';

export interface SortEvent extends SortPage {
  startTime: string,
  endTime: string,
  tags: ThemeTag[],
  formats: EventFormat[],
  times: EventTime[],
  participationFormats: EventParticipationFormat[],
  search: string,
  status: string,
  sort: string,
}
