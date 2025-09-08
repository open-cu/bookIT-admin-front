import {Injectable} from '@angular/core';
import {ApiService, QueryParams} from './api.service';
import {CreateBooking} from '../../models/interfaces/bookings/create-booking';
import {UpdateBooking} from '../../models/interfaces/bookings/update-booking';
import {Booking} from '../../models/interfaces/bookings/booking';
import {SortBooking} from '../../models/interfaces/bookings/sort-booking';
import {HttpParams} from '@angular/common/http';
import {TypeUtils} from '../../utils/type.utils';
import compactObject = TypeUtils.compactObject;

@Injectable({
  providedIn: 'root'
})
export class BookingService extends ApiService<Booking> {
  protected override baseUrl = '/api/bookings';
  private readonly availabilityUrl = `${this.baseUrl}/availability`;

  override delete(bookingId: string) {
    return super.delete(bookingId);
  }

  override get(bookingId: string) {
    return super.get(bookingId);
  }

  override getList(params?: Partial<SortBooking>) {
    return super.getList(params);
  }

  override post(booking: CreateBooking) {
    return super.post(booking);
  }

  override put(bookingId: string, booking: UpdateBooking) {
    return super.put(bookingId, booking);
  }

  getAvailableTimes(params: { date: string, areaId?: string, bookingId?: string }) {
    const httpParams = new HttpParams({
      fromObject: compactObject(params) as QueryParams
    });
    return this.http.get<[string, string, string][]>(
      `${this.availabilityUrl}/times`,
      {params: httpParams}
    );
  }

  getAvailableDates(params?: {areaId?: string}) {
    const httpParams = new HttpParams({
      fromObject: compactObject(params ?? {}) as QueryParams
    });
    return this.http.get<string[]>(
      `${this.availabilityUrl}/dates`,
      {params: httpParams}
    );
  }

  getAvailableAreas(params?: {startTimes?: string[]}) {
    const httpParams = new HttpParams({
      fromObject: compactObject(params ?? {}) as QueryParams
    });
    return this.http.get<string[]>(
      `${this.availabilityUrl}/areas`,
      {params: httpParams}
    );
  }
}
