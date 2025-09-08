import {inject, Injectable} from '@angular/core';
import {TelegramUser} from '../../../models/interfaces/users/telegram-user';
import {UpdateUser} from '../../../models/interfaces/users/update-user';
import {ActiveUser} from '../../../models/interfaces/users/active-user';
import {AUTH_TOKEN} from './auth.token';
import {CookieService} from 'ngx-cookie-service';
import {tap} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
  deps: [AUTH_TOKEN]
})
export class AuthService {
  protected readonly baseUrl = '/api/auth';
  private readonly AUTH_TOKEN = inject(AUTH_TOKEN);
  private cookieService = inject(CookieService);
  private http = inject(HttpClient);

  authorize(user: TelegramUser) {
    const headers = new HttpHeaders({
      'Authorization': `tma ${this.formatRawData(user)}`
    });

    return this.http.post<ActiveUser>(`${this.baseUrl}/telegram`, {}, { headers }).pipe(
      tap(user => this.setTokenCookie(user.token))
    );
  }

  private formatRawData(user: TelegramUser) {
    const userRawData = encodeURIComponent(JSON.stringify(user));
    return `user=${userRawData}`;
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
