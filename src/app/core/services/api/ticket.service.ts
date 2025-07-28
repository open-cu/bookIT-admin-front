import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {Ticket} from '../../models/interfaces/tickets/ticket';
import {SortTicket} from '../../models/interfaces/tickets/sort-ticket';
import {PatchTicket} from '../../models/interfaces/tickets/patch-ticket';
import {CreateTicket} from '../../models/interfaces/tickets/create-ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends ApiService<Ticket> {
  protected override baseUrl = '/api/tickets';

  override delete(ticketId: string) {
    return super.delete(ticketId);
  }

  override get(ticketId: string) {
    return super.get(ticketId);
  }

  override getList(params?: Partial<SortTicket>) {
    return super.getList(params);
  }

  override patch(ticketId: string, ticket: PatchTicket) {
    return super.patch(ticketId, ticket);
  }

  override post(ticket: CreateTicket) {
    return super.post(ticket);
  }
}
