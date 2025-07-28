import {SortObject} from './sort-object';
import {PageableObject} from './pageable-object';

export interface Pageable<T> {
  "totalPages": number,
  "totalElements": number,
  "size": number,
  "content": T[],
  "number": number,
  "sort": SortObject,
  "first": boolean,
  "last": boolean,
  "numberOfElements": number,
  "pageable": PageableObject,
  "empty": boolean,
}
