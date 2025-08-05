import {ColumnConfig} from '../../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../../shared/common-ui/filter-block/filter-config';
import {createEnumOptions} from '../../../core/utils/create-enum-options';
import {CreationConfig} from '../../../shared/common-ui/creation-block/creation-config';
import {DeletionConfig} from '../../../shared/common-ui/table-page/deletion-config';
import {CellRenders} from '../cell-renders';
import {ThemeTag} from '../../../core/models/enums/theme-tag';
import {CreateNews} from '../../../core/models/interfaces/news/create-news';
import {UpdateNews} from '../../../core/models/interfaces/news/update-news';

export const NEWS_COLUMNS_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: CellRenders.withStyle('cell-id')
  },
  {key: "title"},
  {
    key: "description",
    render: CellRenders.withStyle('cell-description')
  },
  {
    key: "tags",
    render: CellRenders.asList()
  },
  {
    key: "images",
    render: CellRenders.asImages()
  },
  {
    key: "createdAt",
    render: CellRenders.asDate()
  },
];

export const NEWS_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'tags',
    placeholder: 'Посик по категориям',
    type: 'multipleSelect',
    options: createEnumOptions(ThemeTag)
  },
  {
    key: 'search',
    placeholder: 'Поиск новости',
  },
];

export const NEWS_CREATION_CONFIG: CreationConfig = {
  button: 'Создать новость',
  title: 'Создание новости',
  options: [
    {
      key: 'title',
      label: 'Заголовок'
    },
    {
      key: 'description',
      label: 'Описание',
    },
    {
      key: 'tags',
      label: 'Категории',
      type: 'multipleSelect',
      options: createEnumOptions(ThemeTag),
      value: [],
    },
    {
      key: 'photos',
      label: 'Фото новости',
      type: 'images',
    }
  ],
};

export const NEWS_EDITION_CONFIG: CreationConfig = {
  button: 'Изменить',
  title: 'Редатирование мероприятий',
  options: [

    {
      key: 'title',
      label: 'Заголовок'
    },
    {
      key: 'description',
      label: 'Описание',
    },
    {
      key: 'tags',
      label: 'Категории',
      type: 'multipleSelect',
      options: createEnumOptions(ThemeTag),
      value: [],
    },
    {
      key: 'photos',
      label: 'Фото новости',
      type: "images"
    }
  ],
}

export const NEWS_DELETION_CONFIG: DeletionConfig = {
  label: 'Вы уверены, что хотите удалить эту новость?'
}

export type CreateNewsFlat = CreateNews['newsUpdateRequest'] & Pick<CreateNews, 'photos'>;
export type UpdateNewsFlat = UpdateNews['newsUpdateRequest'] & Pick<UpdateNews, 'photos'>;
