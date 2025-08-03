import {UserRole} from '../../enums/users/user-role';
import {UserStatus} from '../../enums/users/user-status';

export interface User {
  "id": string,
  "tgId": number,
  "firstName": string,
  "lastName": string,
  "photoUrl": string,
  "email": string,
  "phone": string,
  "status": UserStatus,
  "createdAt": string,
  "updatedAt": string,
  "username": string,
  "roles": UserRole[]
}
