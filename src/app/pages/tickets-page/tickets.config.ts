import {ColumnConfig} from '../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../shared/common-ui/filter-block/filter-config';
import {TicketType} from '../../core/models/enums/ticket-type';
import {TypeUtils} from '../../core/utils/type.utils';
import getEnumKeys = TypeUtils.getEnumKeys;

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
    type: 'dateRange',
    placeholder: 'Поиск по дате'
  },
  {
    key: 'type',
    type: 'select',
    placeholder: 'Поиск по типу',
    options: getEnumKeys(TicketType).map(key => ({value: key})),
  },
  {
    key: 'search',
    type: 'text',
    placeholder: 'Поиск по описанию',
  }
];
