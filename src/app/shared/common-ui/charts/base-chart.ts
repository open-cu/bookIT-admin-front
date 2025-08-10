import {Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {EMPTY, Observable, Subject} from 'rxjs';
import {catchError, debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {StatsService} from '../../../core/services/api/stats.service';

@Component({
  template: ''
})
export abstract class BaseChartComponent<T, P extends object> implements OnInit, OnDestroy, OnChanges {
  protected isLoading = false;
  protected chartData: T | null = null;
  protected error: any = null;

  private destroy$ = new Subject<void>();
  private load$ = new Subject<P>();
  protected debounceTime = 300;
  protected currentParams: Partial<P> = {};

  protected statsService = inject(StatsService);
  protected abstract requiredParams: (keyof P)[];

  @Input() set params(value: Partial<P>) {
    this.updateParams(value);
    this.checkLoad();
  }

  ngOnChanges(changes: SimpleChanges) {
    let needUpdate = false;

    for (const key of Object.keys(changes)) {
      if (this.isParamKey(key)) {
        this.currentParams[key as keyof P] = changes[key].currentValue;
        needUpdate = true;
      }
    }

    if (needUpdate) {
      this.checkLoad();
    }
  }

  ngOnInit() {
    this.setupLoader();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract fetchData(params: P): Observable<T>;

  protected handleError(error: any) {
    console.error('Data loading error:', error);
    this.error = error;
    return EMPTY;
  }

  private setupLoader() {
    this.load$.pipe(
      debounceTime(this.debounceTime),
      tap(() => {
        this.isLoading = true;
        this.error = null;
      }),
      switchMap(params =>
        this.fetchData(params).pipe(
          catchError(error => this.handleError(error))
        )),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.chartData = data;
      this.isLoading = false;
    });
  }

  private updateParams(newParams: Partial<P>) {
    this.currentParams = {...this.currentParams, ...newParams};
  }

  private checkLoad() {
    if (this.hasRequiredParams()) {
      this.load$.next(this.currentParams as P);
    }
  }

  private hasRequiredParams() {
    return this.requiredParams.every(key =>
      this.currentParams[key] !== undefined &&
      this.currentParams[key] !== null
    );
  }

  private isParamKey(key: string) {
    return this.requiredParams.includes(key as keyof P);
  }
}
