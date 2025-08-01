import {ColumnConfig} from '../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../shared/common-ui/filter-block/filter-config';
import {createEnumOptions} from '../../core/utils/create-enum-options';
import {CreationConfig} from '../../shared/common-ui/creation-block/creation-config';
import {DeletionConfig} from '../../shared/common-ui/table-page/deletion-config';
import {provideInjectable} from '../../core/utils/injector.provider';
import {DatePipe} from '@angular/common';
import {BookingService} from '../../core/services/api/booking.service';
import {map} from 'rxjs';
import {BookingTimeline} from '../../core/models/enums/bookings/booking-timeline';
import {BookingStatus} from '../../core/models/enums/bookings/booking-status';

export const BOOKINGS_COLUMNS_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: value => `<p class="cell-id">${value}</p>`
  },
  {
    key: "userId",
    render: value => `<p class="cell-id">${value}</p>`
  },
  {
    key: "areaId",
    render: value => `<p class="cell-id">${value}</p>`
  },
  {
    key: "startTime",
    render: (value: string) => {
      const datePipe = provideInjectable(DatePipe);
      return `<p>${datePipe.transform(value, 'short')}</p>`
    }
  },
  {
    key: "endTime",
    render: (value: string) => {
      const datePipe = provideInjectable(DatePipe);
      return `<p>${datePipe.transform(value, 'short')}</p>`
    }
  },
  {key: "quantity"},
  {key: "status"},
  {
    key: "createdAt",
    render: (value: string) => `<p>${provideInjectable(DatePipe).transform(value, 'short')}</p>`
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
      label: 'id пользователя'
    },
    {
      key: 'areaId',
      label: 'Помещение',
      type: 'select',
      options: []
    },
    {
      key: 'date',
      label: 'Дата',
      type: 'date'
    },
    {
      key: 'intervals',
      label: 'Время',
      type: "multiple-select",
      options: [],
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
      options: []
    },
    {
      key: 'date',
      label: 'Дата',
      type: 'date'
    },
    {
      key: 'intervals',
      label: 'Время',
      type: "multiple-select",
      options: [],
      dependsOn: ['areaId', 'date'],
      loadOptions: createTimeOptions
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

function createTimeOptions(values: Record<string, any>) {
  const datePipe = provideInjectable(DatePipe);
  return provideInjectable(BookingService)
    .getAvailableTimes({
      date: datePipe.transform(values['date'], 'y-MM-dd')!,
      areaId: values['areaId'],
    })
    .pipe(
      map(arr => [...arr[0], ...arr[1], ...arr[2]]),
      map(arr => arr.map(time => ({
        value: time,
        label: time.split(';')
          .map(time => datePipe.transform(time, 'HH:mm'))
          .join('-')
      })))
    );
}
