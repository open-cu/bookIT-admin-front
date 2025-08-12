import {Component, computed, effect, inject, Signal, signal} from '@angular/core';
import {
  NewUsersByYearMonthChartComponent
} from '../../shared/common-ui/charts/new-users-by-year-month-chart/new-users-by-year-month-chart.component';
import {FilterBlockComponent} from "../../shared/common-ui/filter-block/filter-block.component";
import {STATS_FILTER_OPTIONS} from './stats.config';
import {WaResizeObserver} from '@ng-web-apis/resize-observer';
import {FilterOption, FilterResult} from '../../shared/common-ui/filter-block/filter-config';
import {TuiScrollbar} from '@taiga-ui/core';
import {DatePipe} from '@angular/common';
import {
  CancellationsByAreaChartComponent
} from '../../shared/common-ui/charts/cancellations-by-area-chart/cancellations-by-area-chart.component';

@Component({
  selector: 'app-stats-page',
  imports: [
    NewUsersByYearMonthChartComponent,
    FilterBlockComponent,
    WaResizeObserver,
    TuiScrollbar,
    CancellationsByAreaChartComponent
  ],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.css'
})
export class StatsPageComponent {
  protected filterOptions = STATS_FILTER_OPTIONS;
  private filters = signal<FilterResult<FilterOption[]>>({});
  protected statsParams: Signal<object>;
  protected filterHeight = signal(0);
  protected blockSize: Signal<string>;

  private datePipe = inject(DatePipe);

  constructor() {
    this.blockSize = computed<string>(
      () => `calc(100vh - ${170 + this.filterHeight()}px)`
    );
    this.statsParams = computed(() => {
      const filters = this.filters();
      const dates: Date[] = filters['dates'] ?? [];
      const [startDate, endDate] = dates
        .map((date: Date) => this.datePipe.transform(date, 'yyyy-MM-dd'));
      return {
        startDate,
        endDate,
        areaNames: filters['areaNames'] as string[] | null,
      }
    });
    effect(() => {
      console.log(this.statsParams())
    });
  }

  protected onUpdateFilters(filters: FilterResult<FilterOption[]>) {
    this.filters.set(filters);
  }

  protected onFilterResize(entry: readonly ResizeObserverEntry[]) {
    const blockSize = entry[0].borderBoxSize[0].blockSize;
    this.filterHeight.set(blockSize);
  }
}
