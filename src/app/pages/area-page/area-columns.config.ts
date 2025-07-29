import {ColumnConfig} from '../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../shared/common-ui/filter-block/filter-config';
import {CreateArea} from '../../core/models/interfaces/areas/create-area';

export const AREA_COLUMNS_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: (value, row) => `<p class="cell-id">${value}</p>`
  },
  {key: "name"},
  {
    key: "description",
    render: (value, row) => `<p class="cell-description">${value}</p>`
  },
  {key: "type"},
  {key: "features"},
  {key: "images"},
  {key: "capacity"}
];

export const AREA_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'description',
    placeholder: 'Поиск по описанию'
  },
];

export type CreateAreaFlat = CreateArea['createAreaRequest'] & Pick<CreateArea, 'photos'>;
