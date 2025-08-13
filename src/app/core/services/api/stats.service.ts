import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QueryParams} from './api.service';
import {NewUsersCreatedAt} from '../../models/interfaces/stats/data/new-users-created-at';
import {EventOverlap} from '../../models/interfaces/stats/data/event-overlap';
import {CancellationStats} from '../../models/interfaces/stats/data/cancellation-stats';
import {BusiestHours} from '../../models/interfaces/stats/data/busiest-hours';
import {DayOfWeekStats} from '../../models/interfaces/stats/data/day-of-week-stats';
import {FullStats} from '../../models/interfaces/stats/data/full-stats';
import {CancellationStatsParams} from '../../models/interfaces/stats/params/cancellation-stats-params';
import {BusiestHoursStatsParams} from '../../models/interfaces/stats/params/busiest-hours-stats-params';
import {BookingsStatsParams} from '../../models/interfaces/stats/params/bookings-stats-params';
import {BookingsPeriodsStatsParams} from '../../models/interfaces/stats/params/bookings-periods-stats-params';
import {
  BookingsByDayOfWeekStatsParams
} from '../../models/interfaces/stats/params/bookings-by-day-of-week-stats-params';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/stats';

  getNewUsersByYearMonth() {
    return this.http.get<NewUsersCreatedAt[]>(`${this.baseUrl}/new-users-by-year-month`);
  }

  getEventOverlaps() {
    return this.http.get<EventOverlap[]>(`${this.baseUrl}/event-overlaps`);
  }

  getCancellationsByArea(params: CancellationStatsParams) {
    return this.http.get<CancellationStats[]>(
      `${this.baseUrl}/cancellations-by-area`,
      this.getQueryParams(params)
    );
  }

  getBusiestHours(params: BusiestHoursStatsParams) {
    return this.http.get<BusiestHours[]>(
      `${this.baseUrl}/busiest-hours`,
      this.getQueryParams(params)
    );
  }

  getBookings(params: BookingsStatsParams) {
    return this.http.get<FullStats>(
      `${this.baseUrl}/bookings`,
      this.getQueryParams(params)
    );
  }

  getBookingsPeriods(params: BookingsPeriodsStatsParams) {
    return this.http.get<FullStats>(
      `${this.baseUrl}/bookings-period`,
      this.getQueryParams(params)
    );
  }

  getBookingsByDayOfWeek(params: BookingsByDayOfWeekStatsParams) {
    return this.http.get<DayOfWeekStats[]>(
      `${this.baseUrl}/bookings-by-day-of-week`,
      this.getQueryParams(params)
    );
  }

  private getQueryParams(params?: object) {
    const httpParams = new HttpParams({fromObject: params as QueryParams});
    return { params: httpParams };
  }
}
