import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {SortEvent} from '../../models/interfaces/events/sort-event';
import {CreateEvent} from '../../models/interfaces/events/create-event';
import {UpdateEvent} from '../../models/interfaces/events/update-event';

@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService<Event> {
  protected override baseUrl = '/api/events';

  override delete(eventId: string) {
    return super.delete(eventId);
  }

  override get(eventId: string) {
    return super.get(eventId);
  }

  override getList(params?: SortEvent) {
    return super.getList(params);
  }

  override post(event: CreateEvent) {
    return super.post(event);
  }

  override put(eventId: string, event: UpdateEvent) {
    return super.put(eventId, event);
  }
}
