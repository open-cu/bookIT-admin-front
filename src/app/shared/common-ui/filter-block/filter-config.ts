import {SelectOption} from '../creation-block/creation-config';

export type FilterOptions = FilterOption[];

export type FilterType = 'text' | 'date-range' | 'select';

export interface FilterOption {
  key: string,
  value?: string,
  placeholder?: string,
  type?: FilterType,
  options?: SelectOption[],
}

export type FilterResult<T extends FilterOptions> = {
  [K in T[number]['key']]: string;
}
