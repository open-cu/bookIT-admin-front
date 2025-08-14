import {inject, Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {TelegramUser} from '../../../models/interfaces/users/telegram-user';
import {UpdateUser} from '../../../models/interfaces/users/update-user';
import {ActiveUser} from '../../../models/interfaces/users/active-user';
import {AUTH_TOKEN} from './auth.token';
import {CookieService} from 'ngx-cookie-service';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
  deps: [AUTH_TOKEN]
})
export class AuthService extends ApiService {
  protected override baseUrl = '/api/auth';
  private readonly AUTH_TOKEN = inject(AUTH_TOKEN);
  private cookieService = inject(CookieService);

  authorize(user: TelegramUser) {
    return this.http.post<ActiveUser>(`${this.baseUrl}/telegram`, user).pipe(
      tap(user => this.setTokenCookie(user.token))
    );
  }

  complete(user: UpdateUser) {
    return this.http.post<{message: string}>(`${this.baseUrl}/complete-profile`, user);
  }

  logout() {
    return this.cookieService.delete(this.AUTH_TOKEN.key, '/');
  }

  private setTokenCookie(token: string): void {
    const currentDate = new Date().getTime();
    const duration = this.AUTH_TOKEN.expired;
    this.cookieService.set(this.AUTH_TOKEN.key, token, {
      expires: new Date(currentDate + duration),
      path: '/',
      secure: true,
      sameSite: 'Strict',
    });
  }
}
