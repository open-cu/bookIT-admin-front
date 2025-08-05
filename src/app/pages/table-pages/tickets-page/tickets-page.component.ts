import {Component, inject} from '@angular/core';
import {Ticket} from '../../../core/models/interfaces/tickets/ticket';
import {TicketService} from '../../../core/services/api/ticket.service';
import {markAsRequired} from '../../../shared/common-ui/creation-block/creation-config';
import {CreateTicket} from '../../../core/models/interfaces/tickets/create-ticket';
import {
  TicketParams,
  TICKETS_COLUMN_CONFIG,
  TICKETS_CREATION_CONFIG,
  TICKETS_DELETION_CONFIG,
  TICKETS_EDITION_CONFIG,
  TICKETS_FILTER_OPTIONS
} from './tickets.config';
import {TablePageComponent} from '../../../shared/common-ui/table-page/table-page.component';
import {PatchTicket} from '../../../core/models/interfaces/tickets/patch-ticket';
import {DatePipe} from '@angular/common';
import {SortTicket} from '../../../core/models/interfaces/tickets/sort-ticket';

@Component({
  selector: 'app-tickets-page',
  imports: [
    TablePageComponent,
  ],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent extends TablePageComponent<Ticket> {
  override filterOptions = TICKETS_FILTER_OPTIONS;
  override columns = TICKETS_COLUMN_CONFIG;
  override creationConfig = TICKETS_CREATION_CONFIG
  override editionConfig = TICKETS_EDITION_CONFIG;
  override deletionConfig = TICKETS_DELETION_CONFIG;

  private ticketService = inject(TicketService);
  private datePipe= inject(DatePipe);

  constructor() {
    super();
    markAsRequired(this.creationConfig, 'description');
    markAsRequired(this.editionConfig, 'description');
  }

  override loadItemsFn = (params: SortTicket) => {
    return this.ticketService.getList(params);
  }

  override createItemFn = (item: CreateTicket) => {
    return this.ticketService.post(item);
  }

  override deleteItemFn = (item: Ticket) => {
    return this.ticketService.delete(item.id);
  }

  override editItemFn = (item: Ticket, patch: PatchTicket) => {
    return this.ticketService.patch(item.id, patch);
  }

  override transformParamsFn = (params: TicketParams) => {
    const { date: dateRange, ...result } = params;
    const dateArray= dateRange
      ? dateRange.map((date: Date)  => this.datePipe.transform(date, 'y-MM-dd')!) as string[]
      : [null, null];
    return {
      ...result,
      startDate: dateArray[0],
      endDate: dateArray[1],
    } as SortTicket;
  }
}
