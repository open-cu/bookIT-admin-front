import {inject, Injectable, InjectionToken, LOCALE_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';
import {TypeUtils} from '../utils/type.utils';
import toArray = TypeUtils.toArray;

export const USED_LOCALE_ID = new InjectionToken<string>(
  'USED_LOCALE_ID',
  {
    factory: () => inject(LOCALE_ID),
  }
);

@Injectable({
  providedIn: 'root',
  deps: [USED_LOCALE_ID]
})
export class LocalizationService {
  private readonly SOURCE_PATH = 'assets/i18n';
  private readonly http = inject(HttpClient);
  private readonly initialLocale = inject(USED_LOCALE_ID);

  private readonly currentLocale$ = new BehaviorSubject<string>(this.initialLocale);
  private readonly translations$ = this.currentLocale$.pipe(
    switchMap(locale => this.loadTranslations(locale)),
    shareReplay(1)
  );

  constructor() {
    this.translations$.pipe(take(1)).subscribe();
  }

  setLocale(locale: string): void {
    if (locale !== this.currentLocale$.value) {
      this.currentLocale$.next(locale);
    }
  }

  getMapping(keys: string | string[]): Observable<string | undefined> {
    return this.translations$.pipe(
      map(translations => this.getNestedValue(translations, keys))
    );
  }

  private loadTranslations(locale: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`${this.SOURCE_PATH}/${locale}.json`).pipe(
      catchError(error => {
        console.error(`Failed to load translations for ${locale}:`, error);
        return of({});
      })
    );
  }

  private getNestedValue(
    obj: Record<string, unknown>,
    keys: string | string[]
  ): string | undefined {
    const keyArray = toArray(keys);
    let current: unknown = obj;

    for (const key of keyArray) {
      if (current === null || typeof current !== 'object' || Array.isArray(current)) {
        return undefined;
      }
      current = (current as Record<string, unknown>)[key];
    }

    return typeof current === 'string' ? current : undefined;
  }
}
