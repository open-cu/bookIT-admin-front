import {ThemeTag} from '../../enums/theme-tag';
import {SortPage} from '../pagination/sort-page';

export interface SortNews extends SortPage {
  tags: ThemeTag[],
  search: string,
  sort: string,
}
