import {Component, inject} from '@angular/core';
import {Ticket} from '../../core/models/interfaces/tickets/ticket';
import {TicketService} from '../../core/services/api/ticket.service';
import {CreationConfig, markAsRequired} from '../../shared/common-ui/creation-block/creation-config';
import {CreateTicket} from '../../core/models/interfaces/tickets/create-ticket';
import {UserService} from '../../core/services/api/auth/user.service';
import {
  TICKETS_FILTER_OPTIONS,
  TICKETS_COLUMN_CONFIG,
  TICKETS_CREATION_CONFIG,
  TICKETS_EDITION_CONFIG,
  TICKETS_DELETION_CONFIG
} from './tickets.config';
import {TablePageComponent} from '../../shared/common-ui/table-page/table-page.component';
import {PatchTicket} from '../../core/models/interfaces/tickets/patch-ticket';
import {FilterOptions, FilterResult} from '../../shared/common-ui/filter-block/filter-config';
import {AreaService} from '../../core/services/api/area.service';
import {SortPage} from '../../core/models/interfaces/pagination/sort-page';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-tickets-page',
  imports: [
    TablePageComponent,
  ],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.css'
})
export class TicketsPageComponent extends TablePageComponent<Ticket> {
  override filterResult: FilterResult<typeof this.filterOptions> = {};
  override filterOptions: FilterOptions = TICKETS_FILTER_OPTIONS;
  override columns = TICKETS_COLUMN_CONFIG;
  override creationConfig: CreationConfig = TICKETS_CREATION_CONFIG
  override editionConfig = TICKETS_EDITION_CONFIG;
  override deletionConfig = TICKETS_DELETION_CONFIG;

  private ticketService = inject(TicketService);
  private areaService = inject(AreaService);
  private userService = inject(UserService);
  private datePipe= inject(DatePipe);

  constructor() {
    super();
    this.userService.getMe()
      .subscribe(user => this.creationConfig.options[0].value = user.id);
    this.areaService.getList()
      .subscribe(
        areas => this.creationConfig.options[1].options = areas.content
          .map(area => ({value: area.id, label: area.name}))
      );
    markAsRequired(this.creationConfig, 'description');
    markAsRequired(this.editionConfig, 'description');
  }

  override loadItemsFn = (params: SortPage) => {
    return this.ticketService.getList(params);
  }

  override createItemFn = (item: CreateTicket) => {
    return this.ticketService.post(item);
  }

  override deleteItemFn = (item: Ticket) => {
    return this.ticketService.delete(item.id);
  }

  override editItemFn = (item: any, patch: PatchTicket) => {
    return this.ticketService.patch(item['id'], patch);
  }

  override transformParamsFn = (params: any) => {
    const { date: dateRange, ...result } = params;
    const dateArray= dateRange
      ? dateRange.map((date: Date)  => this.datePipe.transform(date, 'y-MM-dd')!) as string[]
      : [null, null];
    return {
      startDate: dateArray[0],
      endDate: dateArray[1],
      ...result
    };
  }
}
