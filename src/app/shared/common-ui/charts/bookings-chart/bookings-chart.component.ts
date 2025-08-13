import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {BookingsStatsParams} from '../../../../core/models/interfaces/stats/params/bookings-stats-params';
import {FullStats} from '../../../../core/models/interfaces/stats/data/full-stats';
import {TuiAxes, TuiLineDaysChart, TuiLineDaysChartHint} from '@taiga-ui/addon-charts';
import {AsyncPipe, DatePipe} from '@angular/common';
import {LocalizePipe} from '../../../pipes/localize.pipe';
import {TuiLoader} from '@taiga-ui/core';
import {BaseBookingsChart, BookingWithDay} from '../base-bookings-chart/base-bookings-chart';
import {ChartTitles} from '../../../../core/models/enums/stats/chart-titles';
import {TuiDay} from '@taiga-ui/cdk';

@Component({
  selector: 'app-bookings-chart',
  imports: [
    AsyncPipe,
    LocalizePipe,
    TuiLoader,
    TuiAxes,
    TuiLineDaysChart,
    TuiLineDaysChartHint,
    DatePipe,
  ],
  standalone: true,
  templateUrl: '../base-bookings-chart/base-bookings-chart.html',
  styleUrls: ['../base-bookings-chart/base-bookings-chart.less']
})
export class BookingsChartComponent extends BaseBookingsChart<BookingsStatsParams> {
  protected override requiredParams: (keyof BookingsStatsParams)[] = ['startDate', 'endDate'];

  protected override requiredParamsMessage = 'Необходим диапозон дат';

  protected override chartTitle = ChartTitles.BOOKINGS;

  constructor() {
    super();
  }

  protected override fetchData(params: BookingsStatsParams): Observable<FullStats> {
    return this.statsService.getBookings(params);
  }

  protected override isEmpty(data: FullStats): boolean {
    return !data?.stats?.length;
  }

  protected override createDayRange(array: BookingWithDay[], _: any): [TuiDay, TuiDay] {
    return [array[0].day, array[array.length - 1].day];
  }
}
