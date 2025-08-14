import {Component, computed, inject, Signal, signal} from '@angular/core';
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
import {
  BusiestHoursChartComponent
} from '../../shared/common-ui/charts/busiest-hours-chart/busiest-hours-chart.component';
import {BookingsChartComponent} from '../../shared/common-ui/charts/bookings-chart/bookings-chart.component';
import {
  BookingsPeriodChartComponent
} from '../../shared/common-ui/charts/bookings-period-chart/bookings-period-chart.component';
import {
  BookingsByDayOfWeekComponent
} from '../../shared/common-ui/charts/bookings-by-day-of-week/bookings-by-day-of-week.component';
import {AiAssistantChatComponent} from '../../shared/common-ui/ai-assistant-chat/ai-assistant-chat.component';

type BoxSize = {
  -readonly [key in keyof ResizeObserverSize]: ResizeObserverSize[key];
}

@Component({
  selector: 'app-stats-page',
  imports: [
    NewUsersByYearMonthChartComponent,
    FilterBlockComponent,
    WaResizeObserver,
    TuiScrollbar,
    CancellationsByAreaChartComponent,
    BusiestHoursChartComponent,
    BookingsChartComponent,
    BookingsPeriodChartComponent,
    BookingsByDayOfWeekComponent,
    AiAssistantChatComponent,
  ],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.css'
})
export class StatsPageComponent {
  protected filterOptions = STATS_FILTER_OPTIONS;
  private filters = signal<FilterResult<FilterOption[]>>({});
  protected statsParams: Signal<object>;
  protected filterHeight = signal(0);
  protected assistantBoxSize = signal<BoxSize>({ blockSize: 0, inlineSize: 0 });
  protected blockSize: Signal<string>;

  private datePipe = inject(DatePipe);

  constructor() {
    this.blockSize = computed<string>(
      () => `calc(100vh - ${24 + this.filterHeight() + this.assistantBoxSize().blockSize}px)`
    );
    this.statsParams = computed(() => {
      const filters = this.filters();
      const {dates, ...rest} = filters;
      const [startDate, endDate] = (dates ?? [])
        .map((date: Date) => date ? this.datePipe.transform(date, 'yyyy-MM-dd') : null);
      return {
        startDate,
        endDate,
        ...rest,
      }
    });
  }

  protected onUpdateFilters(filters: FilterResult<FilterOption[]>) {
    this.filters.set(filters);
  }

  protected onFilterResize(entry: readonly ResizeObserverEntry[]) {
    const { blockSize, inlineSize } = entry[0].borderBoxSize[0];
    this.assistantBoxSize.update(
      ({ blockSize }) => ({inlineSize, blockSize})
    );
    this.filterHeight.set(blockSize);
  }

  protected onAiAssistantResize(entry: readonly ResizeObserverEntry[]) {
    const { blockSize } = entry[0].borderBoxSize[0];
    this.assistantBoxSize.update(
      ({ inlineSize }) => ({inlineSize, blockSize})
    );
  }
}
