import {Component, inject} from '@angular/core';
import {BaseChartComponent} from '../base-chart';
import {NewUsersCreatedAt} from '../../../../core/models/interfaces/stats/new-users-created-at';
import {map} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {TuiDay, TuiStringHandler} from '@taiga-ui/cdk';
import {TuiLoader} from '@taiga-ui/core';
import {TuiAxes, TuiLineDaysChart} from '@taiga-ui/addon-charts';

@Component({
  selector: 'app-new-users-by-year-month-chart',
  imports: [
    TuiLoader,
    TuiAxes,
    TuiLineDaysChart
  ],
  templateUrl: './new-users-by-year-month-chart.component.html',
  styleUrl: './new-users-by-year-month-chart.component.css'
})
export class NewUsersByYearMonthChartComponent extends BaseChartComponent<NewUsersCreatedAt[], {}> {
  protected requiredParams = [];
  protected override debounceTime = 100;

  protected datePipe = inject(DatePipe);

  protected get value(): Array<[TuiDay, number]> {
    return this.chartData?.map(item => {
      const [year, month] = item.created.split('-');
      return [new TuiDay(parseInt(year), parseInt(month) - 1, 1), item.count];
    }) ?? [];
  }

  protected get axisXLabels(): (string | null)[] {
    if (!this.chartData) return [];

    const labels = this.chartData.map(item => {
      const [year, month] = item.created.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return this.datePipe.transform(date, 'MMM') ?? null;
    });

    return [...labels, null];
  }

  protected readonly xStringify: TuiStringHandler<TuiDay> = (day) => {
    const date = new Date(day.year, day.month, day.day);
    return this.datePipe.transform(date, 'MMM yyyy') ?? '';
  };

  protected readonly yStringify: TuiStringHandler<number> = (value) => `${value}`;

  protected override fetchData() {
    return this.statsService.getNewUsersByYearMonth().pipe(
      map(data => this.fillMissingMonths(data))
    );
  }

  private fillMissingMonths(data: NewUsersCreatedAt[]): NewUsersCreatedAt[] {
    if (data.length === 0) return [];

    const dates = data.map(item => new Date(item.created));
    const minDate = new Date(Math.min(...dates.map(date => date.getTime())));
    const maxDate = new Date(Math.max(...dates.map(date => date.getTime())));

    const allMonths: string[] = [];
    const current = new Date(minDate);

    while (current <= maxDate) {
      const year = current.getFullYear();
      const month = (current.getMonth() + 1).toString().padStart(2, '0');
      allMonths.push(`${year}-${month}`);
      current.setMonth(current.getMonth() + 1);
    }

    const dataMap = new Map(data.map(item => [item.created, item.count]));
    return allMonths.map(month => ({
      created: month,
      count: dataMap.get(month) ?? 0
    }));
  }
}
