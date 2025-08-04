import {ColumnConfig} from '../../../shared/common-ui/items-table/column-config';
import {FilterOptions} from '../../../shared/common-ui/filter-block/filter-config';
import {createEnumOptions} from '../../../core/utils/create-enum-options';
import {CreationConfig} from '../../../shared/common-ui/creation-block/creation-config';
import {CellRenders} from '../cell-renders';
import {UserRole} from '../../../core/models/enums/users/user-role';
import {UserStatus} from '../../../core/models/enums/users/user-status';
import {Validators} from '@angular/forms';

export const USERS_COLUMN_CONFIG: ColumnConfig[] = [
  {
    key: "id",
    render: CellRenders.withStyle('cell-id')
  },
  {
    key: "tgId",
    render: CellRenders.withStyle('cell-id'),
  },
  {key: "firstName"},
  {
    key: "lastName",
    render: CellRenders.asNullish()
  },
  {
    key: "photoUrl",
    render: CellRenders.asUrlImage('tgId', 'user-avatar/'),
  },
  {
    key: "email",
    render: CellRenders.asNullish()
  },
  {
    key: "phone",
    render: CellRenders.asNullish()
  },
  {key: "status"},
  {
    key: 'createdAt',
    render: CellRenders.asDate()
  },
  {
    key: 'updatedAt',
    render: CellRenders.asDate()
  },
  {
    key: 'username',
    render: CellRenders.asNullish()
  },
  {
    key: 'roles',
    render: CellRenders.asList()
  },
];

export const USERS_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'role',
    placeholder: 'Поиск по роли',
    type: 'multipleSelect',
    options: createEnumOptions(UserRole),
  },
  {
    key: 'search',
    placeholder: 'Поиск пользователя',
  },
];

export const USERS_EDITION_CONFIG: CreationConfig = {
  button: 'Изменить пользователя',
  title: 'Редатирование пользователя',
  options: [
    {
      key: "firstName",
      label: 'Имя',
    },
    {
      key: "lastName",
      label: 'Фамилия',
      value: '',
    },
    {
      key: "email",
      label: 'Почта',
      validators: Validators.email,
    },
    {
      key: "roles",
      label: 'Роли',
      type: "multipleSelect",
      options: createEnumOptions(UserRole),
    },
    {
      key: "userStatus",
      label: 'Статус',
      type: "select",
      options: createEnumOptions(UserStatus),
    }
  ],
};
