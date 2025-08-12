import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BehaviorSubject, combineLatest, filter, Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, shareReplay, switchMap} from 'rxjs/operators';
import {StatsService} from '../../../core/services/api/stats.service';

@Component({
  template: ''
})
export abstract class BaseChartComponent<T, P extends object> implements OnChanges {
  protected params$ = new BehaviorSubject<Partial<P>>({});

  protected data$: Observable<T | null>;
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
      distinctUntilChanged((prev, curr) =>
        this.requiredParams.every(key =>
          JSON.stringify(prev[key]) === JSON.stringify(curr[key])
        )
      ),
      filter(params => this.hasRequiredParams(params)),
      shareReplay(1)
    );

    this.data$ = filteredParams$.pipe(
      switchMap(params =>
        this.fetchData(params as P).pipe(
          catchError(error => {
            this.handleError(error);
            return of(null);
          })
        )
      ),
      shareReplay(1)
    );

    this.isLoading$ = combineLatest([
      filteredParams$,
      this.data$
    ]).pipe(
      map(([_, data]) => data === null && !this.error$),
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

  protected calculateTicks(min: number, max: number): {
    niceMin: number,
    niceMax: number,
    tickCount: number
  } {
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

  protected abstract fetchData(params: P): Observable<T>;

  protected handleError(error: any): void {
    console.error('Data loading error:', error);
  }

  private updateParams(newParams: Partial<P>): void {
    this.params$.next({
      ...this.params$.value,
      ...newParams
    });
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
