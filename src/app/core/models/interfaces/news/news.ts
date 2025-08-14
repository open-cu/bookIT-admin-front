import {Image} from '../images/image';
import {ThemeTag} from '../../enums/theme-tag';

export interface News {
  "id": string,
  "title": string,
  "description": string,
  "tags": ThemeTag[],
  "images": Image[],
  "createdAt": string
}
