import {SelectOption} from '../creation-block/creation-config';
import {InputType} from '../inputs/input-container/input-container.component';

export type FilterOptions = FilterOption[];

export interface FilterOption {
  key: string,
  value?: any,
  placeholder?: string,
  type?: InputType,
  options?: SelectOption[],
}

export type FilterResult<T extends FilterOptions> = {
  [K in T[number]['key']]: any;
}
