import {UserStatus} from '../../enums/users/user-status';
import {UserRole} from '../../enums/users/user-role';

export interface PatchUser {
  "firstName": string,
  "lastName": string,
  "email": string,
  "roles": UserRole[],
  "userStatus": UserStatus,
}
