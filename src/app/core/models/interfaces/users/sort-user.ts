import {SortPage} from '../pagination/sort-page';
import {UserRole} from '../../enums/users/user-role';

export interface SortUser extends SortPage {
  role: UserRole[],
  search: string,
}
