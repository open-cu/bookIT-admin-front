import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {User} from '../../../models/interfaces/users/user';
import {UpdateUser} from '../../../models/interfaces/users/update-user';
import {SortUser} from '../../../models/interfaces/users/sort-user';
import {PatchUser} from '../../../models/interfaces/users/patch-user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService<User> {
  protected override baseUrl = '/api/users';

  getMe() {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  updateMe(user: UpdateUser) {
    return this.http.put<User>(`${this.baseUrl}/me`, user);
  }

  getQr() {
    return this.http.get(`${this.baseUrl}/me/qr`, {responseType: 'blob'});
  }

  override delete(userId: string) {
    return super.delete(userId);
  }

  override get(userId: string){
    return super.get(userId);
  }

  override getList(params?: Partial<SortUser>) {
    return super.getList(params);
  }

  override patch(userId: string, user: PatchUser) {
    return super.patch(userId, user);
  }
}
