import {SortPage} from '../pagination/sort-page';
import {AreaType} from '../../enums/area-type';

export interface SortArea extends SortPage {
  type: AreaType,
}
