import {SortPage} from '../pagination/sort-page';
import {AreaType} from '../../enums/areas/area-type';

export interface SortArea extends SortPage {
  type: AreaType,
  areaName: string,
}
