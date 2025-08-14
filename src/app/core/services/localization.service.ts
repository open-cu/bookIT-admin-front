import {inject, Injectable, LOCALE_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, shareReplay} from 'rxjs';
import {TypeUtils} from '../utils/type.utils';
import toArray = TypeUtils.toArray;
import getByKey = TypeUtils.getByKey;

@Injectable({
  providedIn: 'root',
  deps: [LOCALE_ID]
})
export class LocalizationService {
  private http = inject(HttpClient);
  private readonly sourcePath = 'assets/i18n' as const;

  private LOCALE_ID = inject(LOCALE_ID);

  private mappings$: Observable<object>;

  constructor() {
    this.mappings$ = this.loadMappings(this.LOCALE_ID).pipe(
      shareReplay(1)
    );
  }

  loadMappings(locale: string) {
    return this.http.get<any>(`${this.sourcePath}/${locale}.json`);
  }

  getMapping(keys: string[] | string) {
    return this.mappings$.pipe(
      map(mappings => this.getNestedField(mappings, keys))
    );
  }

  private getNestedField(obj: any, keys: string[] | string) {
    const array = toArray(keys);
    let result: object | string | undefined = obj?.[array[0]];
    for (const key of keys.slice(1)) {
      if (!result) {
        return undefined;
      }
      if (typeof result === 'string') {
        return result;
      }
      result = getByKey(result, key);
    }
    return result;
  }
}
