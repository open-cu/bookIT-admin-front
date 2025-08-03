import {Component, inject} from '@angular/core';
import {TablePageComponent} from '../../../shared/common-ui/table-page/table-page.component';
import {User} from '../../../core/models/interfaces/users/user';
import {FilterResult} from '../../../shared/common-ui/filter-block/filter-config';
import {UserService} from '../../../core/services/api/auth/user.service';
import {CreationConfig, markAsRequired} from '../../../shared/common-ui/creation-block/creation-config';
import {PatchUser} from '../../../core/models/interfaces/users/patch-user';
import {findIndex} from 'lodash';
import {ADMINS_COLUMN_CONFIG, ADMINS_EDITION_CONFIG, ADMINS_FILTER_OPTIONS} from './admins.config';
import {SortUser} from '../../../core/models/interfaces/users/sort-user';
import {UserRole} from '../../../core/models/enums/users/user-role';
import {TypeUtils} from '../../../core/utils/type.utils';
import getEnumKeys = TypeUtils.getEnumKeys;

@Component({
  selector: 'app-admins-page',
  imports: [
    TablePageComponent
  ],
  templateUrl: './admins-page.component.html',
  styleUrl: './admins-page.component.css'
})
export class AdminsPageComponent extends TablePageComponent<User> {
  override filterResult: FilterResult<typeof this.filterOptions> = {};
  override filterOptions = ADMINS_FILTER_OPTIONS;
  override columns = ADMINS_COLUMN_CONFIG;
  override editionConfig = ADMINS_EDITION_CONFIG;

  private userService = inject(UserService);

  constructor() {
    super();
    markAsRequired(this.editionConfig, 'lastName');
  }

  override loadItemsFn = (params: SortUser) => {
    if (params.role === undefined || params.role.length === 0) {
      params.role = getEnumKeys(UserRole)
        .filter(role => role !== UserRole[UserRole.ROLE_USER]) as any;
    }
    return this.userService.getList({
      ...params,
    });
  }

  override editItemFn = (item: User, patch: PatchUser) => {
    return this.userService.patch(item.id, patch);
  }

  override transformPatchFn = (config: CreationConfig, item: User) => {
    const statusIndex = findIndex(config.options, option => option.key === 'userStatus');
    if (statusIndex < 0) {
      return config;
    }
    config.options[statusIndex].value = item.status;
    return config;
  }
}
