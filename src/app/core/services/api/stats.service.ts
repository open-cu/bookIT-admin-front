import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QueryParams} from './api.service';
import {StatsPeriod} from '../../models/enums/stats/stats-period';
import {NewUsersCreatedAt} from '../../models/interfaces/stats/new-users-created-at';
import {EventOverlap} from '../../models/interfaces/stats/event-overlap';
import {CancellationStats} from '../../models/interfaces/stats/cancellation-stats';
import {BusiestHours} from '../../models/interfaces/stats/busiest-hours';
import {DayOfWeekStats} from '../../models/interfaces/stats/day-of-week-stats';
import {FullStats} from '../../models/interfaces/stats/full-stats';

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

  getCancellationsByArea(params: {
    startDate: string,
    endDate: string
  }) {
    return this.http.get<CancellationStats[]>(
      `${this.baseUrl}/cancellations-by-area`,
      this.getQueryParams(params)
    );
  }

  getBusiestHours(params: {
    startDate: string,
    endDate: string,
    areaName?: string
  }) {
    return this.http.get<BusiestHours[]>(
      `${this.baseUrl}/busiest-hours`,
      this.getQueryParams(params)
    );
  }

  getBookings(params: {
    startDate: string,
    endDate: string,
    includeSummary?: boolean
  }) {
    return this.http.get<FullStats>(
      `${this.baseUrl}/bookings`,
      this.getQueryParams(params)
    );
  }

  getBookingsPeriods(params: {
    period: StatsPeriod,
    includeSummary?: boolean
  }) {
    return this.http.get<FullStats>(
      `${this.baseUrl}/bookings-period`,
      this.getQueryParams(params)
    );
  }

  getBookingsByDayOfWeek(params: {
    startDate: string,
    endDate: string,
  }) {
    return this.http.get<DayOfWeekStats>(
      `${this.baseUrl}/bookings-by-day-of-week`,
      this.getQueryParams(params)
    );
  }

  private getQueryParams(params?: { [p: string]: string | number | boolean | readonly (string | number | boolean)[] }) {
    const httpParams = new HttpParams({fromObject: params as QueryParams});
    return { params: httpParams };
  }
}
