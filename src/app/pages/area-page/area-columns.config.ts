import {ColumnConfig} from '../../shared/common-ui/table-page/column-config';

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
