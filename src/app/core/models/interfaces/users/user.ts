import {UserRole} from '../../enums/users/user-role';
import {UserStatus} from '../../enums/users/user-status';

export interface User {
  "id": string,
  "tgId": number,
  "firstName": string,
  "lastName": string | null,
  "photoUrl": string | null,
  "email": string | null,
  "phone": string | null,
  "status": UserStatus,
  "createdAt": string,
  "updatedAt": string | null,
  "username": string | null,
  "roles": UserRole[]
}
