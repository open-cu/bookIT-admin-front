import {ThemeTag} from '../../enums/theme-tag';

export interface UpdateNews {
  "newsUpdateRequest": {
    "title": string,
    "description": string,
    "tags": ThemeTag[],
  },
  "photos": File[]
}
