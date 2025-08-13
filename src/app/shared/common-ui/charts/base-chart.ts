import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, shareReplay, switchMap} from 'rxjs/operators';
import {StatsService} from '../../../core/services/api/stats.service';
import {TypeUtils} from '../../../core/utils/type.utils';
import {isEqual} from 'lodash';
import compactObject = TypeUtils.compactObject;
import {ChartTitles} from '../../../core/models/enums/stats/chart-titles';

export interface TicksParams {
  niceMin: number,
  niceMax: number,
  tickCount: number
}

export enum ChartState {
  /* Initial state of chart */
  INIT,
  /* Waiting required params to start loading */
  PARAMS_REQUIRED,
  /* Awaiting data */
  LOADING,
  /* Data was successfully received */
  DONE,
  /* Data was received, but empty (depends on isEmpty method) */
  EMPTY_DATA,
  /* Error of data loading */
  ERROR
}

@Component({
  template: ''
})
export abstract class BaseChart<T, P extends object> implements OnChanges {
  protected params$ = new BehaviorSubject<Partial<P>>({});
  protected state$ = new BehaviorSubject<ChartState>(ChartState.INIT);
  protected readonly ChartState = ChartState;
  protected readonly ChartTitles = ChartTitles;

  protected data$: Observable<T | null>;

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
      distinctUntilChanged<Partial<P>>(isEqual),
      tap(params => {
        this.state$.next(
          this.hasRequiredParams(params)
            ? ChartState.LOADING
            : ChartState.PARAMS_REQUIRED
        );
      }),
      filter(params => this.hasRequiredParams(params)),
      shareReplay(1)
    );

    this.data$ = filteredParams$.pipe(
      switchMap(params =>
        this.fetchData(params as P).pipe(
          tap(data => this.state$.next(
            this.isEmpty(data)
              ? ChartState.EMPTY_DATA
              : ChartState.DONE
            )
          ),
          catchError(error => {
            this.handleError(error);
            return of(null);
          }),
        )
      ),
      shareReplay(1)
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
  protected abstract fetchData(params: P): Observable<T>;
  protected abstract isEmpty(data: T): boolean;

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

  protected handleError(error: any): void {
    this.state$.next(ChartState.ERROR);
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
