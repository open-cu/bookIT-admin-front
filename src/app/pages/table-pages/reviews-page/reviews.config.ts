import {ColumnConfig} from '../../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../../shared/common-ui/filter-block/filter-config';
import {CreationConfig} from '../../../shared/common-ui/creation-block/creation-config';
import {DeletionConfig} from '../../../shared/common-ui/table-page/deletion-config';
import {CellRenders} from '../cell-renders';
import {generateSequenceOptions, getMyId, getUserOptions} from '../common-functions';

export const REVIEWS_COLUMNS_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: CellRenders.withStyle('cell-id')
  },
  {
    key: "userId",
    render: CellRenders.withStyle('cell-id')
  },
  {key: "rating"},
  {
    key: "comment",
    render: CellRenders.withStyle('cell-description')
  },
  {
    key: "createdAt",
    render: CellRenders.asDate()
  },
];

export const REVIEWS_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'userId',
    placeholder: 'Посик по пользователю',
    type: 'select',
    loadOptions: getUserOptions
  },
  {
    key: 'rating',
    placeholder: 'Поиск по рейтингу',
    type: 'multipleSelect',
    options: generateSequenceOptions(1, 5)
  },
];

export const REVIEWS_CREATION_CONFIG: CreationConfig = {
  button: 'Создать новость',
  title: 'Создание новости',
  options: [
    {
      key: 'userId',
      label: 'id пользователя',
      loadValue: getMyId
    },
    {
      key: 'rating',
      label: 'Оценка',
      type: 'select',
      options: generateSequenceOptions(1, 5)
    },
    {
      key: 'comment',
      label: 'Комментарий',
    },
  ],
};

export const REVIEWS_DELETION_CONFIG: DeletionConfig = {
  label: 'Вы уверены, что хотите удалить этот отзыв?'
}
