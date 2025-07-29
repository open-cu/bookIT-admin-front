import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../services/api/auth/user.service';
import {Observable} from 'rxjs';
import {User} from '../models/interfaces/users/user';

export const userResolver: ResolveFn<Observable<User>> = (route, state) => {
  const userService = inject(UserService);
  return userService.getMe();
};

export const USER_DATA = Symbol(userResolver.name);
