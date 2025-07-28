import {SortObject} from './sort-object';

export interface PageableObject {
  offset: number,
  sort: SortObject,
  unpaged: boolean,
  paged: boolean,
  pageSize: number,
  pageNumber: number,
}
