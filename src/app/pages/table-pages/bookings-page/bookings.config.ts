import {ColumnConfig} from '../../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../../shared/common-ui/filter-block/filter-config';
import {createEnumOptions} from '../../../core/utils/create-enum-options';
import {CreationConfig} from '../../../shared/common-ui/creation-block/creation-config';
import {DeletionConfig} from '../../../shared/common-ui/table-page/deletion-config';
import {BookingTimeline} from '../../../core/models/enums/bookings/booking-timeline';
import {BookingStatus} from '../../../core/models/enums/bookings/booking-status';
import {createTimeOptions, getAreaOptions, getMyId} from '../common-reactive-values';
import {CellRenders} from '../cell-renders';
import {CreateBooking} from '../../../core/models/interfaces/bookings/create-booking';
import {UpdateBooking} from '../../../core/models/interfaces/bookings/update-booking';
import {TuiTime} from '@taiga-ui/cdk';

export const BOOKINGS_COLUMNS_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: CellRenders.withStyle('cell-id')
  },
  {
    key: "userId",
    render: CellRenders.withStyle('cell-id')
  },
  {
    key: "areaId",
    render: CellRenders.withStyle('cell-id')
  },
  {
    key: "startTime",
    render: CellRenders.asDate()
  },
  {
    key: "endTime",
    render: CellRenders.asDate()
  },
  {key: "quantity"},
  {key: "status"},
  {
    key: "createdAt",
    render: CellRenders.asDate()
  }
];

export const BOOKINGS_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'timeline',
    placeholder: 'Поиск по завершённости',
    type: 'select',
    options: createEnumOptions(BookingTimeline)
  },
  {
    key: 'areaId',
    placeholder: 'Поиск по помещению',
    type: 'select',
    options: []
  },
  {
    key: 'userId',
    placeholder: 'Поиск по пользователю (id)',
  },
  {
    key: 'startTime',
    placeholder: 'Поиск по времени начала',
    type: 'dateTime'
  },
  {
    key: 'startTime',
    placeholder: 'Поиск по времени окончания',
    type: 'dateTime'
  },
];

export const BOOKINGS_CREATION_CONFIG: CreationConfig = {
  button: 'Создать бронь',
  title: 'Создание брони',
  options: [
    {
      key: 'userId',
      label: 'id пользователя',
      loadValue: getMyId
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
      type: 'date'
    },
    {
      key: 'intervals',
      label: 'Время',
      type: "multipleSelect",
      dependsOn: ['areaId', 'date'],
      loadOptions: createTimeOptions
    },
    {
      key: 'quantity',
      label: 'Количество человек',
      type: 'number',
    },
  ],
};

export const BOOKINGS_EDITION_CONFIG: CreationConfig = {
  button: 'Изменить бронь',
  title: 'Изменение брони',
  options: [
    {
      key: 'areaId',
      label: 'Помещение',
      type: 'select',
      loadOptions: getAreaOptions,
    },
    {
      key: 'date',
      label: 'Дата',
      type: 'date'
    },
    {
      key: 'startTime',
      label: 'Время начало',
      type: "time",
    },
    {
      key: 'endTime',
      label: 'Время окончания',
      type: "time",
    },
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      options: createEnumOptions(BookingStatus)
    }
  ],
}

export const BOOKINGS_DELETION_CONFIG: DeletionConfig = {
  label: 'Вы уверены, что хотите отменить этe бронь?'
}

export type BookingCreationItem = Omit<CreateBooking, 'startTime' | 'endTime'> & {
  intervals: string[],
  date: Date,
}

export type BookingUpdateItem = Omit<UpdateBooking, 'startTime' | 'endTime'> & {
  startTime: TuiTime,
  endTime: TuiTime,
  date: Date,
}
