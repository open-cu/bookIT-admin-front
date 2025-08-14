import {Component} from '@angular/core';
import {BaseBookingsChart} from '../base-bookings-chart/base-bookings-chart';
import {ChartTitles} from '../../../../core/models/enums/stats/chart-titles';
import {Observable} from 'rxjs';
import {FullStats} from '../../../../core/models/interfaces/stats/data/full-stats';
import {
  BookingsPeriodsStatsParams
} from '../../../../core/models/interfaces/stats/params/bookings-periods-stats-params';
import {AsyncPipe, DatePipe} from '@angular/common';
import {LocalizePipe} from '../../../pipes/localize.pipe';
import {TuiLoader} from '@taiga-ui/core';
import {TuiAxes, TuiLineDaysChart, TuiLineDaysChartHint} from '@taiga-ui/addon-charts';
import {TuiDay} from '@taiga-ui/cdk';
import {StatsPeriod} from '../../../../core/models/enums/stats/stats-period';

@Component({
  selector: 'app-bookings-period-chart',
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
export class BookingsPeriodChartComponent  extends BaseBookingsChart<BookingsPeriodsStatsParams> {
  protected override requiredParams: (keyof BookingsPeriodsStatsParams)[] = ['period'];

  protected override chartTitle = ChartTitles.BOOKINGS_PERIOD;

  protected override requiredParamsMessage = 'Необходимо выбрать период';

  constructor() {
    super();
  }

  protected override fetchData(params: BookingsPeriodsStatsParams): Observable<FullStats> {
    return this.statsService.getBookingsPeriods(params);
  }

  protected override isEmpty(data: FullStats): boolean {
    return !data?.stats?.length;
  }

  protected override createDayRange(_: any, params: Partial<BookingsPeriodsStatsParams>): [TuiDay | undefined, TuiDay] {
    const today = TuiDay.currentLocal();
    let startDate: TuiDay | undefined = undefined;
    let endDate = today;

    if (params.period === undefined || params.period === null) {
      return [startDate, endDate];
    }

    switch (Number(StatsPeriod[params.period])) {
      case StatsPeriod.FORTNIGHT:
        startDate = today.append({ day: -14 });
        break;
      case StatsPeriod.MONTH:
        startDate = today.append({ month: -1 });
        break;
      case StatsPeriod.QUARTER:
        startDate = today.append({ month: -3 });
        break;
      case StatsPeriod.WEEK:
        startDate = today.append({ day: -7 });
        break;
    }

    if (startDate !== undefined) {
      startDate.append({ day: 1 });
    }

    return [startDate, endDate];
  }
}
