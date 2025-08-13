import {Component, inject} from '@angular/core';
import {BaseChartComponent} from '../base-chart';
import {NewUsersCreatedAt} from '../../../../core/models/interfaces/stats/data/new-users-created-at';
import {map, shareReplay} from 'rxjs/operators';
import {AsyncPipe, DatePipe} from '@angular/common';
import {TuiStringHandler} from '@taiga-ui/cdk';
import {TuiLoader, TuiPoint} from '@taiga-ui/core';
import {TuiAxes, TuiLineChart} from '@taiga-ui/addon-charts';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-new-users-by-year-month-chart',
  standalone: true,
  imports: [
    TuiLoader,
    TuiAxes,
    AsyncPipe,
    TuiLineChart
  ],
  templateUrl: './new-users-by-year-month-chart.component.html',
  styleUrls: ['./new-users-by-year-month-chart.component.css']
})
export class NewUsersByYearMonthChartComponent extends BaseChartComponent<NewUsersCreatedAt[], {}> {
  protected override requiredParams = [];
  protected override debounceTime = 0;
  private datePipe = inject(DatePipe);

  private filledValues$ = this.data$.pipe(
    map(data => data ? this.fillMissingMonths(data) : []),
    shareReplay(1)
  );

  protected readonly axisXPadding: number = 1;
  protected width$ = this.filledValues$.pipe(
    map(data => data.length + this.axisXPadding)
  );

  protected values$ = this.filledValues$.pipe(
    map(filledData => filledData.map(
      (item, i) => [i, item.count] as TuiPoint)
    ),
    shareReplay(1)
  );
  private labels$ = this.filledValues$.pipe(
    map(data => data.map(item => item.created)),
    map(data => ['', ...data, '']),
    shareReplay(1)
  );

  protected axisXLabels$ = this.labels$.pipe(
    map(labels => labels.map(label => this.formatMonthLabel(label)))
  );

  protected axisYTicks$ = this.filledValues$.pipe(
    map(values => this.calculateTicks(0, values.length
      ? Math.max(...values.map(v => v.count))
      : 0
    ))
  );

  protected axisYLabels$ = this.axisYTicks$.pipe(
    map(data => this.generateTicksValues(data))
  );

  protected readonly yStringify: TuiStringHandler<number> = String;

  protected readonly xStringify: Observable<TuiStringHandler<number>> = this.axisXLabels$.pipe(
    map(data => (value: number) => data[value + 1])
  );

  protected override fetchData() {
    return this.statsService.getNewUsersByYearMonth();
  }

  protected override isEmpty = () => false;

  private formatMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    if (year === undefined || month === undefined) {
      return '';
    }
    const date = new Date(+year, +month - 1, 1);
    return this.datePipe.transform(date, 'MMM yyyy') ?? '';
  }

  private fillMissingMonths(data: NewUsersCreatedAt[]): NewUsersCreatedAt[] {
    if (data.length === 0) {
      return [];
    }

    const result: NewUsersCreatedAt[] = [];
    const first = data[0];
    const last = data[data.length - 1];

    const [startYear, startMonth] = first.created.split('-').map(Number);
    const [endYear, endMonth] = last.created.split('-').map(Number);

    let currentYear = startYear;
    let currentMonth = startMonth;
    let dataIndex = 0;

    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

      if (dataIndex < data.length && data[dataIndex].created === monthKey) {
        result.push(data[dataIndex]);
        dataIndex++;
      } else {
        result.push({ created: monthKey, count: 0 });
      }

      if (currentMonth === 12) {
        currentYear++;
        currentMonth = 1;
      } else {
        currentMonth++;
      }
    }

    return result;
  }
}
