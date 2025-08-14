import {
  CreateEffectOptions,
  effect,
  inject,
  Injectable,
  InjectionToken,
  isDevMode,
  signal,
  WritableSignal
} from '@angular/core';
import {ActivatedRoute, Params, QueryParamsHandling, Router} from '@angular/router';
import {map} from 'rxjs';
import {Filter, FilterAsSignal, FilterOptions, FilterSignals} from './filter.types';
import {convertValueToString, createFilter, getValue, parseSingleValue,} from './filter.utils';
import {isArray, isObject} from 'lodash';

export const FILTER_OPTIONS = new InjectionToken<FilterOptions>(
  'Filter options',
  {
    providedIn: 'any',
    factory: () => ({})
  }
);

@Injectable({
  providedIn: 'any',
  deps: [FILTER_OPTIONS]
})
export class FilterService {
  private readonly filterOptions = inject(FILTER_OPTIONS);

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private filter_ = new Map<string, WritableSignal<any>>();
  public readonly filter!: Filter;

  constructor() {
    for (const [key, option] of Object.entries(this.filterOptions)) {
      this.filter_.set(key, signal(option?.initial));
      if (isDevMode()) {
        effect(() => {
          console.log(`Filter signal [${key}] changed value to\n`, this.filter_.get(key)!());
        });
      }
    }
    this.filter = createFilter(this.filter_);
  }

  public registerFilterToQuery(
    filter: Filter | FilterSignals | FilterAsSignal,
    queryParamsHandling?: QueryParamsHandling | null,
    options?: CreateEffectOptions
  ) {
    return effect(() => {
      const params = this.getFilterAsQuery(filter);

      this.router.navigate([], {
        queryParams: params,
        queryParamsHandling: queryParamsHandling,
        replaceUrl: true
      }).catch(e => console.error('Navigation error', e));
    }, options);
  }

  public initFilterFromQuery(filter: Filter | FilterSignals) {
    return this.activatedRoute.queryParams.pipe(
      map((params) => {
        for (let [key, signal] of filter.entries()) {
          let value = params[key];
          if (value) {
            try {
              filter.get(key)?.set(this.parseQueryValue(params[key], signal()));
            } catch (e) {
              console.error(`Cannot init param '${key}' from query: ${params[key]}`);
            }
          }
        }
        return filter;
      })
    );
  }

  public getFilterAsQuery(filter: Filter | FilterSignals | FilterAsSignal): Params {
    const params: Params = {};
    const currentFilter = getValue(filter, false);
    for (const [key, value] of currentFilter.entries()) {
      params[key] = this.convertToQuery(getValue(value, false));
    }
    return params;
  }

  private convertToQuery(value: any, key?: string): string | string[] | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    if (key && this.filterOptions[key]?.toQuery) {
      return this.filterOptions[key]?.toQuery(value);
    }

    if (isArray(value)) {
      return value.map(item => convertValueToString(item));
    }

    if (isObject(value)) {
      return JSON.stringify(value);
    }

    return String(value);
  }

  private parseQueryValue(value: string | string[], key?: string, currentType?: any): any {
    if (key && this.filterOptions[key]?.fromQuery) {
      return this.filterOptions[key]?.fromQuery(value);
    }

    if (isArray(value)) {
      return value.map(item => parseSingleValue(item, currentType));
    }

    return parseSingleValue(value, currentType);
  }
}
