import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {QueryParams} from './api.service';
import {StatsPeriod} from '../../models/enums/stats/stats-period';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/stats';

  getNewUsersByYearMonth() {
    return this.http.get(`${this.baseUrl}/new-users-by-year-month`);
  }

  getEventOverlaps() {
    return this.http.get(`${this.baseUrl}/event-overlaps`);
  }

  getCancellationsByArea(params: {
    startDate: string,
    endDate: string
  }) {
    return this.http.get(`${this.baseUrl}/cancellations-by-area`, this.getQueryParams(params));
  }

  getBusiestHours(params: {
    startDate: string,
    endDate: string,
    areaName?: string
  }) {
    return this.http.get(`${this.baseUrl}/busiest-hours`, this.getQueryParams(params));
  }

  getBookings(params: {
    startDate: string,
    endDate: string,
    includeSummary?: boolean
  }) {
    return this.http.get(`${this.baseUrl}/bookings`, this.getQueryParams(params));
  }

  getBookingsPeriods(params: {
    period: StatsPeriod,
    includeSummary?: boolean
  }) {
    return this.http.get(`${this.baseUrl}/bookings-period`, this.getQueryParams(params));
  }

  getBookingsByDayOfWeek(params: {
    startDate: string,
    endDate: string,
  }) {
    return this.http.get(`${this.baseUrl}/bookings-by-day-of-week`, this.getQueryParams(params));
  }

  private getQueryParams(params?: { [p: string]: string | number | boolean | readonly (string | number | boolean)[] }) {
    const httpParams = new HttpParams({fromObject: params as QueryParams});
    return { params: httpParams };
  }
}
