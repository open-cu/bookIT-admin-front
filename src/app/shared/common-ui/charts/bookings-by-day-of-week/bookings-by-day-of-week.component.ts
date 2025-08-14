import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {LocalizePipe} from "../../../pipes/localize.pipe";
import {TuiAxes, TuiLineChart, TuiLineChartHint} from "@taiga-ui/addon-charts";
import {TuiLoader, TuiPoint} from "@taiga-ui/core";
import {BaseChart} from '../base-chart';
import {DayOfWeekStats} from '../../../../core/models/interfaces/stats/data/day-of-week-stats';
import {
  BookingsByDayOfWeekStatsParams
} from '../../../../core/models/interfaces/stats/params/bookings-by-day-of-week-stats-params';
import {filter, Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {TuiStringHandler} from '@taiga-ui/cdk';

type DayOfWeekInfo = Omit<DayOfWeekStats, 'areaName'>;

@Component({
  selector: 'app-bookings-by-day-of-week',
  imports: [
    AsyncPipe,
    LocalizePipe,
    TuiAxes,
    TuiLoader,
    TuiLineChart,
    TuiLineChartHint
  ],
  templateUrl: './bookings-by-day-of-week.component.html',
  styleUrl: '../base-bookings-chart/base-bookings-chart.less'
})
export class BookingsByDayOfWeekComponent extends BaseChart<DayOfWeekStats[], BookingsByDayOfWeekStatsParams> {
  protected override requiredParams: (keyof BookingsByDayOfWeekStatsParams)[] = ['startDate', 'endDate'];

  private readonly daysOfWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
  ] as const;

  protected valueMap$ = this.data$.pipe(
    filter(data => data !== null),
    map(data => this.transformStatsToMap(data))
  );

  protected areaNames$ = this.valueMap$.pipe(
    map(data => [...data.keys()]),
    shareReplay(1)
  );

  protected lines$ = this.valueMap$.pipe(
    map(data => {
      const result: TuiPoint[][] = [];
      for (const [_, value] of data.entries()) {
        const line = value.map((item, i) => {
          const { totalBookings } = item;
          return [i, totalBookings] as TuiPoint;
        });
        result.push(line);
      }
      return result;
    }),
  );

  protected continuousLines$ = this.valueMap$.pipe(
    map(data => this.fillDaysOfWeek(data))
  );

  protected axisYTicks$ = this.lines$.pipe(
    map(data => Math.max(...data.flat().map(item => item[1]))),
    map(data => this.calculateTicks(0, data))
  );

  protected axisYLabels$ = this.axisYTicks$.pipe(
    map(data => this.generateTicksValues(data))
  );

  protected readonly axisXLabels = [...this.daysOfWeek, ''];

  protected readonly yStringify = String;
  protected readonly xStringify: TuiStringHandler<number> = (value: number)=>
    value > 0 ? this.daysOfWeek[value] : '';

  protected override fetchData(params: BookingsByDayOfWeekStatsParams): Observable<DayOfWeekStats[]> {
    return this.statsService.getBookingsByDayOfWeek(params);
  }

  protected override isEmpty(data: DayOfWeekStats[]): boolean {
    return data.length === 0;
  }

  private transformStatsToMap(stats: DayOfWeekStats[]) {
    const map = new Map<string, DayOfWeekInfo[]>();

    for (const { areaName, ...value} of stats) {
      if (!map.has(areaName)) {
        map.set(areaName, new Array<DayOfWeekInfo>());
      }
      map.get(areaName)!.push(value);
    }

    return map;
  }

  private fillDaysOfWeek(data: Map<string, DayOfWeekInfo[]>) {
    const result: TuiPoint[][] = [];

    for (const [_, bookings] of data.entries()) {
      const seriesMap = new Map<string, number>();

      bookings.forEach(booking => {
        seriesMap.set(booking.dayOfWeek, booking.totalBookings);
      });

      const continuousSeries: TuiPoint[] = [];

      for (let i = 0; i < 7; ++i) {
        const key = this.daysOfWeek[i];
        const value = seriesMap.get(key) ?? 0;
        continuousSeries.push([i, value]);
      }

      result.push(continuousSeries);
    }

    return result;
  }
}
