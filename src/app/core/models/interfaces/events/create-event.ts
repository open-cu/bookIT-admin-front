import {ThemeTag} from '../../enums/theme-tag';
import {EventFormat} from '../../enums/events/event-format';
import {EventTime} from '../../enums/events/event-time';
import {EventParticipationFormat} from '../../enums/events/event-participation-format';

export interface CreateEvent {
  "updateEventRequest": {
    "name": string,
    "description": string,
    "tags": ThemeTag[],
    "formats": EventFormat[],
    "times": EventTime[],
    "participationFormats": EventParticipationFormat[],
    "startTime": string,
    "endTime": string,
    "available_places": number,
    "areaId": string
  },
  "photos": File[]
}
