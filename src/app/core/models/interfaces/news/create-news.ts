import { ThemeTag } from "../../enums/theme-tag";

export interface CreateNews {
  "newsUpdateRequest": {
    "title": string,
    "description": string,
    "tags": ThemeTag[],
  },
  "photos": File[]
}
