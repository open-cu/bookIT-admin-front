import {Component} from '@angular/core';
import {BaseChartComponent} from '../base-chart';
import {CancellationStats} from '../../../../core/models/interfaces/stats/data/cancellation-stats';
import {Observable} from 'rxjs';
import {CancellationStatsParams} from '../../../../core/models/interfaces/stats/params/cancellation-stats-params';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {TUI_ALWAYS_NONE, TuiAxes, TuiBarChart} from '@taiga-ui/addon-charts';
import {TuiHintOptionsDirective, TuiLoader} from '@taiga-ui/core';
import {map, shareReplay} from 'rxjs/operators';

@Component({
  selector: 'app-cancellations-by-area-chart',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiAxes,
    TuiLoader,
    TuiBarChart,
    TuiHintOptionsDirective,
    DecimalPipe,

  ],
  templateUrl: './cancellations-by-area-chart.component.html',
  styleUrls: ['./cancellations-by-area-chart.component.css']
})
export class CancellationsByAreaChartComponent extends BaseChartComponent<CancellationStats[], CancellationStatsParams> {
  protected requiredParams: (keyof CancellationStatsParams)[] = ['startDate', 'endDate'];

  protected value$ = this.data$.pipe(
    map(data => {
      if (!data) {
        return [[], []];
      }

      const result: [number[], number[]] = [[], []];
      for (const value of data) {
        result[0].push(value.totalBookings - value.cancelledBookings);
        result[1].push(value.cancelledBookings);
      }
      return result;
    }),
    shareReplay(1)
  );

  protected axisYTicks$ = this.value$.pipe(
    map(data => {
      const sums = [];
      for (let i = 0; i < data[0].length; i++) {
        sums.push(data[0][i] + data[1][i]);
      }
      return this.calculateTicks(0, Math.max(...sums, 0));
    })
  )

  protected axisYLabels$ = this.axisYTicks$.pipe(
    map(ticks => this.generateTicksValues(ticks))
  );

  protected axisXLabels$ = this.data$.pipe(
    map(data => data ? data.map(value => value.areaName) : [])
  );

  protected readonly verticalLinesHandler = TUI_ALWAYS_NONE;

  protected fetchData(params: CancellationStatsParams): Observable<CancellationStats[]> {
    return this.statsService.getCancellationsByArea(params);
  }
}
