import {Component, inject} from '@angular/core';
import {FilterBlockComponent} from '../../shared/common-ui/filter-block/filter-block.component';
import {TuiButton} from '@taiga-ui/core';
import {Ticket} from '../../core/models/interfaces/tickets/ticket';
import {TicketService} from '../../core/services/api/ticket.service';
import {SortTicket} from '../../core/models/interfaces/tickets/sort-ticket';
import {TablePageComponent} from '../../shared/common-ui/table-page/table-page.component';

@Component({
  selector: 'app-tickets-page',
  imports: [
    FilterBlockComponent,
    TuiButton,
    TablePageComponent
  ],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent extends TablePageComponent<Ticket> {
  protected fields: Record<string, string> = {
    date: '',
    area: '',
    description: '',
  };
  protected fieldsPlaceholders: Record<keyof typeof this.fields, string> = {
    date: 'По дате',
    area: 'По помещению',
    description: 'По описанию',
  }

  protected ticketColumns = [
    {key: "id"},
    {key: "userId"},
    {key: "areaId"},
    {key: "type"},
    {key: "description"},
  ];

  private ticketService = inject(TicketService);

  protected fetchItems = (params: Partial<SortTicket>) => {
    return this.ticketService.getList(params);
  }
}
