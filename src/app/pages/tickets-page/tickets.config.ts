import {ColumnConfig} from '../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../shared/common-ui/filter-block/filter-config';
import {TicketType} from '../../core/models/enums/ticket-type';
import {createEnumOptions} from '../../core/utils/create-enum-options';
import {CreationConfig} from '../../shared/common-ui/creation-block/creation-config';
import {DeletionConfig} from '../../shared/common-ui/table-page/deletion-config';
import {AppValidators} from '../../shared/validators/app.validators';

const ticketGroupValidator = AppValidators.requiredIfGroup({
  description: (group) => {
    return group.get('type')?.value === TicketType[TicketType.OTHER]
  }
});

export const TICKETS_COLUMN_CONFIG: ColumnConfig[] = [
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
    options: createEnumOptions(TicketType),
  },
  {
    key: 'search',
    type: 'text',
    placeholder: 'Поиск по описанию',
  }
];

export const TICKETS_CREATION_CONFIG: CreationConfig = {
  button: 'Создать тикет',
  title: 'Создание тикета',
  options: [
    {
      key: 'userId',
      label: 'id пользователя'
    },
    {
      key: 'areaId',
      label: 'Помещение',
      type: 'select',
    },
    {
      key: 'type',
      label: 'Тип',
      type: 'select',
      options: createEnumOptions(TicketType),
    },
    {
      key: 'description',
      label: 'Описание',
      value: '',
    },
  ],
  validators: ticketGroupValidator
};

export const TICKETS_EDITION_CONFIG: CreationConfig = {
  button: 'Изменить тикет',
  title: 'Редатирование тикета',
  options: [
    {
      key: 'type',
      label: 'Тип',
      type: 'select',
      options: createEnumOptions(TicketType),
    },
    {
      key: 'description',
      label: 'Описание',
    },
  ],
  validators: ticketGroupValidator
}

export const TICKETS_DELETION_CONFIG: DeletionConfig = {
  label: 'Вы уверены, что хотите удалить этот тикет?'
}
