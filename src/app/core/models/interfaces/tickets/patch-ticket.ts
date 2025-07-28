import {TicketType} from '../../enums/ticket-type';

export interface PatchTicket {
  "type": TicketType,
  "description": string,
}
