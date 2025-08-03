import {Component, inject} from '@angular/core';
import {TablePageComponent} from '../../../shared/common-ui/table-page/table-page.component';
import {User} from '../../../core/models/interfaces/users/user';
import {FilterResult} from '../../../shared/common-ui/filter-block/filter-config';
import {CreationConfig, markAsRequired} from '../../../shared/common-ui/creation-block/creation-config';
import {SortPage} from '../../../core/models/interfaces/pagination/sort-page';
import {UserService} from '../../../core/services/api/auth/user.service';
import {PatchUser} from '../../../core/models/interfaces/users/patch-user';
import {USERS_COLUMN_CONFIG, USERS_EDITION_CONFIG, USERS_FILTER_OPTIONS} from './users.config';
import {findIndex} from 'lodash';

@Component({
  selector: 'app-users-page',
  imports: [
    TablePageComponent
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent extends TablePageComponent<User> {
  override filterResult: FilterResult<typeof this.filterOptions> = {};
  override filterOptions = USERS_FILTER_OPTIONS;
  override columns = USERS_COLUMN_CONFIG;
  override editionConfig = USERS_EDITION_CONFIG;

  private userService = inject(UserService);

  constructor() {
    super();
    markAsRequired(this.editionConfig, 'lastName');
  }

  override loadItemsFn = (params: SortPage) => {
    return this.userService.getList(params);
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
