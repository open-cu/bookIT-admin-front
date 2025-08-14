import {TicketType} from '../../enums/tickets/ticket-type';
import {TicketPriority} from '../../enums/tickets/ticket-priority';
import {TicketStatus} from '../../enums/tickets/ticket-status';

export interface CreateTicket {
  "userId": string,
  "areaId": string,
  "type": TicketType,
  "description": string,
  "priority": TicketPriority,
  "status": TicketStatus
}
