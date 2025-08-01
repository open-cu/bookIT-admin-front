import {TicketType} from '../../enums/tickets/ticket-type';

export interface PatchTicket {
  "type": TicketType,
  "description": string,
}
