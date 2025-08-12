import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BehaviorSubject, filter, Observable, of, Subject, tap} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {StatsService} from '../../../core/services/api/stats.service';
import {TypeUtils} from '../../../core/utils/type.utils';
import compactObject = TypeUtils.compactObject;
import {isEqual} from 'lodash';

export interface TicksParams {
  niceMin: number,
  niceMax: number,
  tickCount: number
}

@Component({
  template: ''
})
export abstract class BaseChartComponent<T, P extends object> implements OnChanges {
  protected params$ = new BehaviorSubject<Partial<P>>({});

  protected data$: Observable<T | null>;
  protected loadingTrigger$ = new Subject<boolean>();
  protected isLoading$: Observable<boolean>;
  protected error$: Observable<any | null>;

  protected statsService = inject(StatsService);

  protected abstract requiredParams: (keyof P)[];

  protected debounceTime: number = 300;
  protected niceStepConfig = {
    desiredTicks: 5,
    minHeight: 1,
    minValue: 0,
    paddingFactor: 0.2
  };

  @Input() set params(value: Partial<P>) {
    this.updateParams(value);
  }

  constructor() {
    const filteredParams$ = this.params$.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(isEqual),
      filter(params => this.hasRequiredParams(params)),
      tap(() => this.loadingTrigger$.next(true)),
      shareReplay(1)
    );

    this.data$ = filteredParams$.pipe(
      switchMap(params =>
        this.fetchData(params as P).pipe(
          catchError(error => {
            this.handleError(error);
            return of(null);
          }),
          tap(() => this.loadingTrigger$.next(false))
        )
      ),
      shareReplay(1)
    );

    this.isLoading$ = this.loadingTrigger$.pipe(
      startWith(true),
      distinctUntilChanged()
    );

    this.error$ = this.data$.pipe(
      map(data => data === null ? 'Error loading data' : null),
      distinctUntilChanged()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const updatedParams: Partial<P> = {};
    let hasChanges = false;

    for (const key of Object.keys(changes)) {
      if (this.isParamKey(key)) {
        updatedParams[key as keyof P] = changes[key].currentValue;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.updateParams(updatedParams);
    }
  }

  protected calculateTicks(min: number, max: number): TicksParams {
    const config = this.niceStepConfig;

    if (min === max) {
      return {
        niceMin: Math.max(0, min - 1),
        niceMax: min + 1,
        tickCount: 2
      };
    }

    const range = max - min;
    const rawStep = range / (config.desiredTicks - 1);

    const exponent = Math.floor(Math.log10(rawStep));
    const scale = Math.pow(10, exponent);

    const normalizedStep = rawStep / scale;
    let selectedStep;

    if (normalizedStep <= 1) selectedStep = 1;
    else if (normalizedStep <= 2) selectedStep = 2;
    else if (normalizedStep <= 5) selectedStep = 5;
    else selectedStep = 10;

    const niceStep = selectedStep * scale;

    let niceMin = Math.floor(min / niceStep) * niceStep;
    let niceMax = Math.ceil(max / niceStep) * niceStep;

    if (niceMax === max) {
      niceMax += niceStep;
    }

    const tickCount = Math.round((niceMax - niceMin) / niceStep);

    return {
      niceMin,
      niceMax,
      tickCount
    };
  }

  protected generateTicksValues(params: TicksParams) {
    const {niceMin, niceMax, tickCount} = params;
    const step = (niceMax - niceMin) / tickCount;
    let array: string[] = [];
    for (let i = 0; i < tickCount + 1; ++i) {
      const value = String(niceMin + i * step)
      array.push(value);
    }
    return array;
  }

  protected abstract fetchData(params: P): Observable<T>;

  protected handleError(error: any): void {
    console.error('Data loading error:', error);
  }

  private updateParams(newParams: Partial<P>): void {
    const newValue = compactObject({
      ...this.params$.value,
      ...newParams
    })
    this.params$.next(newValue);
  }

  private hasRequiredParams(params: Partial<P>): boolean {
    return this.requiredParams.every(key =>
      params[key] !== undefined &&
      params[key] !== null
    );
  }

  private isParamKey(key: string): boolean {
    return this.requiredParams.includes(key as keyof P);
  }
}
