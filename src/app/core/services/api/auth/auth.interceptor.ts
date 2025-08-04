import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {APP_ROUTES} from '../../../../app.routes.paths';
import {AUTH_TOKEN} from './auth.token';

@Injectable({
  providedIn: 'root',
  deps: [AUTH_TOKEN]
})
export class AuthInterceptor implements HttpInterceptor {
  private readonly AUTH_TOKEN = inject(AUTH_TOKEN);

  private cookieService = inject(CookieService);
  private router = inject(Router);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isTokenExists = this.cookieService.check(this.AUTH_TOKEN.key);

    if (!isTokenExists) {
      this.navigateOnAuthPage().then();
    }

    const token = this.cookieService.get(this.AUTH_TOKEN.key);

    const authReq = this.addTokenToRequest(request, token);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Unauthorized');
          this.navigateOnAuthPage().then(() => this.clearToken());
        }
        return throwError(() => error);
      })
    );
  }

  private navigateOnAuthPage() {
    return this.router.navigate(['/', APP_ROUTES.LOGIN]);
  }

  private addTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private clearToken(): void {
    this.cookieService.delete(this.AUTH_TOKEN.key, '/');
  }
}
