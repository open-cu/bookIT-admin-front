import {ColumnConfig} from '../../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../../shared/common-ui/filter-block/filter-config';
import {CreateArea} from '../../../core/models/interfaces/areas/create-area';
import {createEnumOptions} from '../../../core/utils/create-enum-options';
import {AreaType} from '../../../core/models/enums/areas/area-type';
import {CreationConfig} from '../../../shared/common-ui/creation-block/creation-config';
import {DeletionConfig} from '../../../shared/common-ui/table-page/deletion-config';
import {UpdateArea} from '../../../core/models/interfaces/areas/update-area';
import {AreaFeature} from '../../../core/models/enums/areas/area-feature';
import {CellRenders} from '../cell-renders';

export const AREAS_COLUMNS_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: CellRenders.withStyle('cell-id')
  },
  {key: "name"},
  {
    key: "description",
    render: CellRenders.withStyle('cell-description')
  },
  {key: "type"},
  {
    key: "features",
    render: CellRenders.asList()
  },
  {
    key: "images",
    render: CellRenders.asImages()
  },
  {key: "capacity"}
];

export const AREAS_FILTER_OPTIONS: FilterOptions = [
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

export const AREAS_CREATION_CONFIG: CreationConfig = {
  button: 'Создать помещение',
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
      type: 'multipleSelect',
      options: createEnumOptions(AreaFeature),
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

export const AREAS_EDITION_CONFIG: CreationConfig = {
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

export const AREAS_DELETION_CONFIG: DeletionConfig = {
  label: 'Вы уверены, что хотите удалить это помещение?'
}

export type CreateAreaFlat = CreateArea['createAreaRequest'] & Pick<CreateArea, 'photos'>;
export type UpdateAreaFlat = UpdateArea['updateAreaRequest'] & Pick<UpdateArea, 'photos'>;
