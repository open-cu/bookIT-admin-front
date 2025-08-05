import {ColumnConfig} from '../../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../../shared/common-ui/filter-block/filter-config';
import {createEnumOptions} from '../../../core/utils/create-enum-options';
import {CreationConfig} from '../../../shared/common-ui/creation-block/creation-config';
import {DeletionConfig} from '../../../shared/common-ui/table-page/deletion-config';
import {CellRenders} from '../cell-renders';
import {CreateEvent} from '../../../core/models/interfaces/events/create-event';
import {UpdateEvent} from '../../../core/models/interfaces/events/update-event';
import {ThemeTag} from '../../../core/models/enums/theme-tag';
import {EventFormat} from '../../../core/models/enums/events/event-format';
import {EventTime} from '../../../core/models/enums/events/event-time';
import {EventParticipationFormat} from '../../../core/models/enums/events/event-participation-format';
import {EventStatus} from '../../../core/models/enums/events/event-status';
import {createTimeOptions, getAreaOptions} from '../common-functions';
import {TuiTime} from '@taiga-ui/cdk';

export const EVENTS_COLUMNS_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: CellRenders.withStyle('cell-id')
  },
  {key: "name"},
  {
    key: "description",
    render: CellRenders.withStyle('cell-description')
  },
  {
    key: "tags",
    render: CellRenders.asList()
  },
  {
    key: "formats",
    render: CellRenders.asList()
  },
  {
    key: "times",
    render: CellRenders.asList()
  },
  {
    key: "participationFormats",
    render: CellRenders.asList()
  },
  {
    key: "images",
    render: CellRenders.asImages()
  },
  {
    key: "startTime",
    render: CellRenders.asDate()
  },
  {
    key: "endTime",
    render: CellRenders.asDate()
  },
  {key: "availablePlaces"},
  {
    key: "areaId",
    render: CellRenders.withStyle('cell-id')
  }
];

export const EVENTS_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'startTime',
    placeholder: 'Времени начала',
    type: 'dateTime',
  },
  {
    key: 'endTime',
    placeholder: 'Время окончания',
    type: 'dateTime',
  },
  {
    key: 'tags',
    placeholder: 'Категории',
    type: 'multipleSelect',
    options: createEnumOptions(ThemeTag)
  },
  {
    key: 'formats',
    placeholder: 'Формат проведения',
    type: 'multipleSelect',
    options: createEnumOptions(EventFormat)
  },
  {
    key: 'times',
    placeholder: 'Время суток',
    type: 'multipleSelect',
    options: createEnumOptions(EventTime)
  },
  {
    key: 'participationFormats',
    placeholder: 'Формат участия',
    type: 'multipleSelect',
    options: createEnumOptions(EventParticipationFormat)
  },
  {
    key: 'search',
    placeholder: 'Поиск мероприятия',
  },
  {
    key: 'status',
    placeholder: 'Статус',
    type: 'select',
    options: createEnumOptions(EventStatus)
  }
];

export const EVENTS_CREATION_CONFIG: CreationConfig = {
  button: 'Создать мероприятие',
  title: 'Создание мероприятия',
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
      key: 'tags',
      label: 'Категории',
      type: 'multipleSelect',
      options: createEnumOptions(ThemeTag),
      value: [],
    },
    {
      key: 'formats',
      label: 'Формат проведения',
      type: 'multipleSelect',
      options: createEnumOptions(EventFormat),
      value: [],
    },
    {
      key: 'times',
      label: 'Время суток',
      type: 'multipleSelect',
      options: createEnumOptions(EventTime),
      value: [],
    },
    {
      key: 'participationFormats',
      label: 'Формат участия',
      type: 'multipleSelect',
      options: createEnumOptions(EventParticipationFormat),
      value: [],
    },
    {
      key: 'areaId',
      label: 'Помещение',
      type: 'select',
      loadOptions: getAreaOptions
    },
    {
      key: 'date',
      label: 'Дата',
      type: 'date',
    },
    {
      key: 'intervals',
      label: 'Время',
      type: "multipleSelect",
      dependsOn: ['areaId', 'date'],
      loadOptions: createTimeOptions,
    },
    {
      key: 'available_places',
      label: 'Количество доступных мест',
      type: 'number',
    },
    {
      key: 'photos',
      label: 'Фото мероприятия',
      type: "images"
    }
  ],
};

export const EVENTS_EDITION_CONFIG: CreationConfig = {
  button: 'Изменить',
  title: 'Редатирование мероприятий',
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
      key: 'tags',
      label: 'Категории',
      type: 'multipleSelect',
      options: createEnumOptions(ThemeTag),
      value: [],
    },
    {
      key: 'formats',
      label: 'Формат проведения',
      type: 'multipleSelect',
      options: createEnumOptions(EventFormat),
      value: [],
    },
    {
      key: 'times',
      label: 'Время суток',
      type: 'multipleSelect',
      options: createEnumOptions(EventTime),
      value: [],
    },
    {
      key: 'participationFormats',
      label: 'Формат участия',
      type: 'multipleSelect',
      options: createEnumOptions(EventParticipationFormat),
      value: [],
    },
    {
      key: 'areaId',
      label: 'Помещение',
      type: 'select',
      loadOptions: getAreaOptions
    },
    {
      key: 'date',
      label: 'Дата',
      type: 'date',
    },
    {
      key: 'startTime',
      label: 'Время начала',
      type: 'time',
    },
    {
      key: 'endTime',
      label: 'Время окончания',
      type: 'time',
    },
    {
      key: 'available_places',
      label: 'Количество доступных мест',
      type: 'number',
    },
    {
      key: 'photos',
      label: 'Фото мероприятия',
      type: "images"
    }
  ],
}

export const EVENTS_DELETION_CONFIG: DeletionConfig = {
  label: 'Вы уверены, что хотите отменить это мероприятие?'
}

export type CreateEventFlat = CreateEvent['updateEventRequest'] & Pick<CreateEvent, 'photos'>;
export type CreateEventParams = Omit<CreateEventFlat, 'startTime' | 'endTime'> & {
  intervals: string[],
  date: Date,
};

export type UpdateEventFlat = UpdateEvent['updateEventRequest'] & Pick<UpdateEvent, 'photos'>;
export type UpdateEventParams = Omit<UpdateEventFlat, 'startTime' | 'endTime'> & {
  startTime: TuiTime,
  endTime: TuiTime,
  date: Date,
};
