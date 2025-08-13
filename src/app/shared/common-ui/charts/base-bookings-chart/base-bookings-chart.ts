import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BaseChart} from '../base-chart';
import {FullStats} from '../../../../core/models/interfaces/stats/data/full-stats';
import {BehaviorSubject, combineLatest, filter, map} from 'rxjs';
import {TuiDay, TuiDayRange, TuiStringHandler} from '@taiga-ui/cdk';
import {shareReplay} from 'rxjs/operators';
import {BookingStats} from '../../../../core/models/interfaces/stats/data/booking-stats';
import {ChartTitles} from '../../../../core/models/enums/stats/chart-titles';

export type BookingWithDay =  Omit<BookingStats, 'date'> & { day: TuiDay };
export type BookingInfo = Omit<BookingWithDay, 'areaName'>;

@Component({
  template: '',
})
export abstract class BaseBookingsChart<P extends object> extends BaseChart<FullStats, P> {
  protected abstract chartTitle: ChartTitles;
  protected abstract requiredParamsMessage: string;

  private datePipe = inject(DatePipe);

  private rangeSubject$ = new BehaviorSubject<TuiDayRange>(
    new TuiDayRange(TuiDay.currentLocal(), TuiDay.currentLocal())
  );

  private range$ = this.rangeSubject$.asObservable();

  protected valueMap$ = combineLatest([
    this.data$,
    this.params$
  ]).pipe(
    filter(data => data[0] !== null),
    map(data => this.transformStatsToMap(data[0]!.stats, data[1]))
  );

  protected areaNames$ = this.valueMap$.pipe(
    map(data => [...data.keys()]),
    shareReplay(1)
  );

  protected continuousLines$ = combineLatest([
    this.valueMap$,
    this.range$,
  ]).pipe(
    map(([valueMap, range]) => this.fillDays(valueMap, range))
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

  protected constructor() {
    super()
    this.xStringify = (day: TuiDay) =>
      this.datePipe.transform(day.toLocalNativeDate(), 'd MMMM, yyyy') ?? '';
  }

  protected abstract createDayRange(array: BookingWithDay[], params: Partial<P>): [
    TuiDay | null | undefined,
    TuiDay | null | undefined
  ];

  private transformStatsToMap(stats: BookingStats[], params: Partial<P>) {
    const array = this.sortStatsByDate(stats);
    const [first, last] = this.createDayRange(array, params);

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

  private sortStatsByDate(stats: BookingStats[]) {
    const boolToNum = (val: boolean) => 2 * Number(val) - 1;

    return [...stats]
      .map(item => {
        const { date, ...rest } = item;
        return {
          ...rest,
          day: TuiDay.normalizeParse(date, 'YMD'),
        }
      }).sort((a, b) => boolToNum(a.day.daySameOrAfter(b.day)));

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

      for (let i = 0; i <= daysCount; ++i) {
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
