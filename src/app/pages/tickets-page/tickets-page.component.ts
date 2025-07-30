import {Component, inject} from '@angular/core';
import {Ticket} from '../../core/models/interfaces/tickets/ticket';
import {TicketService} from '../../core/services/api/ticket.service';
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
import {AreaService} from '../../core/services/api/area.service';
import {SortPage} from '../../core/models/interfaces/pagination/sort-page';

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
      {
        key: 'userId',
        label: 'id пользователя'
      },
      {
        key: 'areaId',
        label: 'Помещение',
        type: 'select',
      },
      {
        key: 'type',
        label: 'Тип',
        type: 'select',
        options: getEnumKeys(TicketType).map(key => ({value: key})),
      },
      {
        key: 'description',
        label: 'Описание',
        value: ''
      },
    ],
  };

  override columns = TICKETS_COLUMN_CONFIG;

  private ticketService = inject(TicketService);
  private areaService = inject(AreaService);
  private userService = inject(UserService);

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

  override editItemFn = (id: string, item: PatchTicket) => {
    return this.ticketService.patch(id, item);
  }

  override transformParamsFn = (params: any) => {
    const { areaId, type, date: dateRange, ...result } = params;
    return {
      areaId: this.extractFromSelect(areaId),
      type: this.extractFromSelect(type),
      ...this.extractFromDayRange(dateRange),
      ...result
    };
  }
}
