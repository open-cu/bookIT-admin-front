import {Component, inject} from '@angular/core';
import {Ticket} from '../../core/models/interfaces/tickets/ticket';
import {TicketService} from '../../core/services/api/ticket.service';
import {SortTicket} from '../../core/models/interfaces/tickets/sort-ticket';
import {CreationConfig, markAsRequired} from '../../shared/common-ui/creation-block/creation-config';
import {TicketType} from '../../core/models/enums/ticket-type';
import {TypeUtils} from '../../core/utils/type.utils';
import getEnumKeys = TypeUtils.getEnumKeys;
import {CreateTicket} from '../../core/models/interfaces/tickets/create-ticket';
import {UserService} from '../../core/services/api/auth/user.service';
import {TICKETS_FILTER_OPTIONS, TICKETS_COLUMN_CONFIG} from './tickets.config';
import {TablePageComponent} from '../../shared/common-ui/table-page/table-page.component';
import {PatchTicket} from '../../core/models/interfaces/tickets/patch-ticket';
import {FilterOptions, FilterResult} from '../../shared/common-ui/filter-block/filter-config';

@Component({
  selector: 'app-tickets-page',
  imports: [
    TablePageComponent
  ],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent extends TablePageComponent<Ticket> {
  override filterOptions: FilterOptions = TICKETS_FILTER_OPTIONS;
  override filterResult: FilterResult<typeof this.filterOptions> = {};

  override creationConfig: CreationConfig = {
    button: 'Создать тикет',
    title: 'Создание тикета',
    options: [
      {key: 'userId'},
      {key: 'areaId'},
      {
        key: 'type',
        type: 'select',
        options: getEnumKeys(TicketType).map(key => ({value: key})),
      },
      {key: 'description'},
    ],
  };

  override columns = TICKETS_COLUMN_CONFIG;

  private ticketService = inject(TicketService);
  private userService = inject(UserService);

  constructor() {
    super();
    this.userService.getMe().subscribe(user => this.creationConfig.options[0].value = user.id);
    markAsRequired(this.creationConfig, 'description');
  }

  override loadItemsFn = (params: Partial<SortTicket>) => {
    return this.ticketService.getList(params);
  }

  override createItemFn = (item: CreateTicket) => {
    return this.ticketService.post(item);
  }

  override deleteItemFn = (item: Ticket) => {
    return this.ticketService.delete(item.id);
  }

  override editItemFn = (id: string, item: PatchTicket) => {
    return this.ticketService.patch(id, item);
  }
}
