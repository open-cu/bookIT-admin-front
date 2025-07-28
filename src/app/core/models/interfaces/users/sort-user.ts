import {SortPage} from '../pagination/sort-page';

export interface SortUser extends SortPage {
  role: string[],
  search: string,
}
