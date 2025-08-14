import {TicketType} from '../../enums/tickets/ticket-type';
import {TicketPriority} from '../../enums/tickets/ticket-priority';
import {TicketStatus} from '../../enums/tickets/ticket-status';

export interface PatchTicket {
  "type": TicketType,
  "description": string,
  "priority": TicketPriority,
  "status": TicketStatus
  "reason": string
}
