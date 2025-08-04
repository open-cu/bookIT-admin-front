import {EventFormat} from '../../enums/events/event-format';
import {ThemeTag} from '../../enums/theme-tag';
import {Image} from '../images/image';
import {EventTime} from '../../enums/events/event-time';
import {EventParticipationFormat} from '../../enums/events/event-participation-format';

export interface Event {
  "id": string,
  "name": string,
  "description": string,
  "tags": ThemeTag[],
  "formats": EventFormat[],
  "times": EventTime[],
  "participationFormats": EventParticipationFormat[],
  "images": Image[],
  "startTime": string,
  "endTime": string,
  "availablePlaces": number,
  "areaId": string
}
