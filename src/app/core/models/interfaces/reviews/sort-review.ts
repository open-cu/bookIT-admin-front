import {SortPage} from '../pagination/sort-page';

export interface SortReview extends SortPage {
  userId: string,
  rating: number,
}
