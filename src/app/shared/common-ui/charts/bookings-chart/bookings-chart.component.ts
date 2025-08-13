import {Component, inject} from '@angular/core';
import {BehaviorSubject, combineLatest, filter, map, Observable} from 'rxjs';
import {BaseChartComponent} from '../base-chart';
import {BookingsStatsParams} from '../../../../core/models/interfaces/stats/params/bookings-stats-params';
import {FullStats} from '../../../../core/models/interfaces/stats/data/full-stats';
import {TuiDay, TuiDayRange, TuiStringHandler} from '@taiga-ui/cdk';
import {TuiAxes, TuiLineDaysChart, TuiLineDaysChartHint} from '@taiga-ui/addon-charts';
import {AsyncPipe, DatePipe} from '@angular/common';
import {LocalizePipe} from '../../../pipes/localize.pipe';
import {TuiLoader} from '@taiga-ui/core';
import {BookingStats} from '../../../../core/models/interfaces/stats/data/booking-stats';
import {shareReplay} from 'rxjs/operators';

type BookingWithDay =  Omit<BookingStats, 'date'> & { day: TuiDay };
type BookingInfo = Omit<BookingWithDay, 'areaName'>;

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
  templateUrl: './bookings-chart.component.html',
  styleUrls: ['./bookings-chart.component.less']
})
export class BookingsChartComponent extends BaseChartComponent<FullStats, BookingsStatsParams> {
  protected override requiredParams: (keyof BookingsStatsParams)[] = ['startDate', 'endDate'];
  private datePipe = inject(DatePipe);

  private rangeSubject$ = new BehaviorSubject<TuiDayRange>(
    new TuiDayRange(TuiDay.currentLocal(), TuiDay.currentLocal())
  );

  private range$ = this.rangeSubject$.asObservable();

  protected valueMap$ = this.data$.pipe(
    filter(data => data !== null),
    map(data => this.transformStatsToMap(data.stats))
  );

  protected areaNames$ = this.valueMap$.pipe(
    map(data => [...data.keys()]),
    shareReplay(1)
  );

  protected continuousLines$ = combineLatest([
    this.valueMap$,
    this.range$,
  ]).pipe(
    map(([valueMap, range]) => this.fillDays(valueMap, range)),
  );

  protected lines$ = this.valueMap$.pipe(
    map(data => {
      const result: [TuiDay, number][][] = [];
      for (const [_, value] of data.entries()) {
        const line = value.map(item => {
          const { day, totalBookings } = item;
          return [day, totalBookings] as [TuiDay, number];
        });
        result.push(line);
      }
      return result;
    }),
  );

  protected axisYTicks$ = this.lines$.pipe(
    map(data => Math.max(2, ...data.flat().map(item => item[1]))),
    map(data => this.calculateTicks(0, data))
  );

  protected axisYLabels$ = this.axisYTicks$.pipe(
    map(data => this.generateTicksValues(data)),
  );

  protected readonly yStringify = String;
  protected readonly xStringify: TuiStringHandler<TuiDay>;

  constructor() {
    super();
    this.xStringify = (day: TuiDay) =>
      this.datePipe.transform(day.toLocalNativeDate(), 'd MMMM, yyyy') ?? '';
  }

  protected override fetchData(params: BookingsStatsParams): Observable<FullStats> {
    return this.statsService.getBookings(params);
  }

  protected override isEmpty(data: FullStats): boolean {
    return !data?.stats?.length;
  }

  private transformStatsToMap(stats: BookingStats[]) {
    const boolToNum = (val: boolean) => 2 * Number(val) - 1;

    const array: BookingWithDay[] = stats
      .map(item => {
      const { date, ...rest } = item;
      return {
        ...rest,
        day: TuiDay.normalizeParse(date, 'YMD'),
      }
    }).sort((a, b) => boolToNum(a.day.daySameOrAfter(b.day)));

    const [first, last] = [array[0].day, array[array.length - 1].day];

    if (first && last) {
      this.rangeSubject$.next(new TuiDayRange(first, last));
    }

    const map = new Map<string, BookingInfo[]>();

    for (const { areaName, ...value} of array) {
      if (!map.has(areaName)) {
        map.set(areaName, new Array<BookingInfo>());
      }
      map.get(areaName)!.push(value);
    }

    return map;
  }

  private fillDays(valueMap: Map<string, BookingInfo[]>, range: TuiDayRange) {
    const result: [TuiDay, number][][] = [];

    for (const [_, bookings] of valueMap.entries()) {
      const seriesMap = new Map<string, number>();

      bookings.forEach(booking => {
        seriesMap.set(booking.day.toString(), booking.totalBookings);
      });

      const continuousSeries: [TuiDay, number][] = [];
      let current = range.from;
      const daysCount = TuiDay.lengthBetween(range.from, range.to);

      for (let i = 0; i <= daysCount; i++) {
        const key = current.toString();
        continuousSeries.push([
          current,
          seriesMap.get(key) ?? 0
        ]);
        current = current.append({ day: 1 });
      }

      result.push(continuousSeries);
    }

    return result;
  }

  protected toDate(day: TuiDay) {
    return day.toLocalNativeDate();
  }
}
