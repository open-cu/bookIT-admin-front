import {ColumnConfig} from '../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../shared/common-ui/filter-block/filter-config';

export const TICKETS_COLUMN_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: value => `<p class="cell-id">${value}</p>`
  },
  {key: "userId"},
  {key: "areaId"},
  {key: "type"},
  {key: "description"},
];

export const TICKETS_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'date',
    placeholder: 'Поиск по дате'
  },
  {
    key: 'area',
    placeholder: 'Поиск по помещению'
  },
  {
    key: 'description',
    placeholder: 'Поиск по описанию'
  }
];
