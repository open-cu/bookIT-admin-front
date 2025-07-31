import {ColumnConfig} from '../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../shared/common-ui/filter-block/filter-config';
import {CreateArea} from '../../core/models/interfaces/areas/create-area';
import {createEnumOptions} from '../../core/utils/create-enum-options';
import {AreaType} from '../../core/models/enums/area-type';
import {CreationConfig} from '../../shared/common-ui/creation-block/creation-config';
import {DeletionConfig} from '../../shared/common-ui/table-page/deletion-config';
import {UpdateArea} from '../../core/models/interfaces/areas/update-area';

export const AREA_COLUMNS_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: value => `<p class="cell-id">${value}</p>`
  },
  {key: "name"},
  {
    key: "description",
    render: value => `<p class="cell-description">${value}</p>`
  },
  {key: "type"},
  {key: "features"},
  {key: "photos"},
  {key: "capacity"}
];

export const AREA_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'areaName',
    placeholder: 'Поиск по описанию'
  },
  {
    key: 'type',
    placeholder: 'Поиск по типу',
    type: 'select',
    options: createEnumOptions(AreaType)
  }
];

export const AREA_CREATION_CONFIG: CreationConfig = {
  button: 'Создать',
  title: 'Создание помещения',
  options: [
    {
      key: 'name',
      label: 'Название'
    },
    {
      key: 'description',
      label: 'Описание',
    },
    {
      key: 'type',
      label: 'Тип',
      type: 'select',
      options: createEnumOptions(AreaType),
    },
    {
      key: 'features',
      label: 'Особенности',
      type: 'multiple',
      placeholder: 'Enter'
    },
    {
      key: 'capacity',
      label: 'Вместимость',
      type: 'number',
    },
    {
      key: 'photos',
      label: 'Фото помещения',
      type: 'images',
      value: []
    }
  ],
};

export const AREA_EDITION_CONFIG: CreationConfig = {
  button: 'Изменить',
  title: 'Редатирование помещения',
  options: [
    {
      key: 'name',
      label: 'Название',
    },
    {
      key: 'type',
      label: 'Тип',
      type: 'select',
      options: createEnumOptions(AreaType),
    },
    {
      key: 'capacity',
      label: 'Вместимость',
      type: 'number',
    },
    {
      key: 'photos',
      label: 'Фото помещения',
      type: 'images',
    }
  ],
}

export const AREA_DELETION_CONFIG: DeletionConfig = {
  label: 'Вы уверены, что хотите удалить это помещение?'
}

export type CreateAreaFlat = CreateArea['createAreaRequest'] & Pick<CreateArea, 'photos'>;
export type UpdateAreaFlat = UpdateArea['updateAreaRequest'] & Pick<UpdateArea, 'photos'>;
