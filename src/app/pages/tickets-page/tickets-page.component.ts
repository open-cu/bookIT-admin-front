import {Component, inject} from '@angular/core';
import {FilterBlockComponent} from '../../shared/common-ui/filter-block/filter-block.component';
import {TuiButton, tuiDialog} from '@taiga-ui/core';
import {Ticket} from '../../core/models/interfaces/tickets/ticket';
import {TicketService} from '../../core/services/api/ticket.service';
import {SortTicket} from '../../core/models/interfaces/tickets/sort-ticket';
import {TablePageComponent} from '../../shared/common-ui/table-page/table-page.component';
import {CreationConfig} from '../../shared/common-ui/creation-block/creation-config';
import {CreationBlockComponent} from '../../shared/common-ui/creation-block/creation-block.component';
import {TicketType} from '../../core/models/enums/ticket-type';
import {TypeUtils} from '../../core/utils/type.utils';
import getEnumKeys = TypeUtils.getEnumKeys;
import {CreateTicket} from '../../core/models/interfaces/tickets/create-ticket';
import {EMPTY, switchMap} from 'rxjs';
import {UserService} from '../../core/services/api/auth/user.service';

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

  protected columns = [
    {key: "id"},
    {key: "userId"},
    {key: "areaId"},
    {key: "type"},
    {key: "description"},
  ];

  private userService = inject(UserService);

  protected creationConfig: CreationConfig = {
    button: 'Создать тикет',
    title: 'Создание тикета',
    options: [
      {key: 'userId'},
      {key: 'areaId'},
      {
        key: 'type',
        type: 'select',
        options: getEnumKeys(TicketType).map(key => ({value: key, label: 'Что-то'})),
      },
      {key: 'description'},
    ],
  };

  constructor() {
    super();
    this.userService.getMe().subscribe(user => this.creationConfig.options[0].value = user.id);
  }

  private readonly creationDialog = tuiDialog(CreationBlockComponent, {
    dismissible: true,
  });

  protected isFilterOpened = false;

  private ticketService = inject(TicketService);

  protected fetchItems = (params: Partial<SortTicket>) => {
    return this.ticketService.getList(params);
  }

  protected onCreateNewItem() {
    this.creationDialog(this.creationConfig)
      .pipe(
        switchMap(item => item ? this.ticketService.post(item as CreateTicket) : EMPTY)
      )
      .subscribe(() => this.updateItems());
  }
}
