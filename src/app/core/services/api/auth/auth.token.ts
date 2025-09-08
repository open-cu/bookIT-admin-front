import {InjectionToken} from '@angular/core';
import {convertTime} from '../../../utils/time.utils';

export const AUTH_TOKEN = new InjectionToken<{key: string, expired: number}>('AUTH_TOKEN', {
  factory: () => ({
    key: 'auth_token',
    expired: convertTime(24, 'hours')
  })
});

export const AUTH_URL = new InjectionToken<string>('AUTH_URL', {
  factory: () => '/api/auth/telegram'
})
