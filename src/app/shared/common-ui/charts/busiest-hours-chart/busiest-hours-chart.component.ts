import {Component, inject} from '@angular/core';
import {BaseChartComponent} from '../base-chart';
import {BusiestHours} from '../../../../core/models/interfaces/stats/data/busiest-hours';
import {BusiestHoursStatsParams} from '../../../../core/models/interfaces/stats/params/busiest-hours-stats-params';
import {combineLatest, Observable} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {TuiAxes, TuiLineChart} from '@taiga-ui/addon-charts';
import {TuiLoader, TuiPoint} from '@taiga-ui/core';
import {map, shareReplay} from 'rxjs/operators';
import {findIndex} from 'lodash';
import {LocalizePipe} from '../../../pipes/localize.pipe';

@Component({
  selector: 'app-busiest-hours-chart',
  imports: [
    AsyncPipe,
    TuiAxes,
    TuiLineChart,
    TuiLoader,
    LocalizePipe
  ],
  templateUrl: './busiest-hours-chart.component.html',
  styleUrl: './busiest-hours-chart.component.css'
})
export class BusiestHoursChartComponent extends BaseChartComponent<BusiestHours[], BusiestHoursStatsParams> {
  protected override requiredParams: (keyof BusiestHoursStatsParams)[] = ['startDate', 'endDate'];
  private datePipe = inject(DatePipe);

  protected value$ = this.data$.pipe(
    map(data => data ? data : []),
    map(data => data.map(item => [item.hour, item.bookingsCount] as TuiPoint)),
    shareReplay(1),
  );

  protected axisYTicks$ = this.value$.pipe(
    map(data => this.calculateTicks(
      0,
      Math.max(...data.map(item => item[1]), 0)
    ))
  );

  protected axisXLabels$ = this.value$.pipe(
    map(data => data.map(item => this.formatHour(item[0]))),
    map(data => [...data, '']),
  );

  protected axisYLabels$ = this.axisYTicks$.pipe(
    map(data => this.generateTicksValues(data))
  );

  protected readonly yStringify = String;

  protected readonly xStringify = combineLatest([
    this.value$,
    this.axisXLabels$
  ]).pipe(
    map(data => (value: number) => {
      const index = findIndex(data[0], (item) => item[0] === value);
      return index > 0 ? data[1][index] : '';
    })
  );

  private formatHour(value: number) {
    const date = new Date();
    date.setHours(value, 0);
    return this.datePipe.transform(date, 'HH:mm') ?? String(value);
  }

  protected override fetchData(params: BusiestHoursStatsParams): Observable<BusiestHours[]> {
    return this.statsService.getBusiestHours(params);
  }

  protected override isEmpty(data: BusiestHours[]): boolean {
    return data.length === 0;
  }
}
