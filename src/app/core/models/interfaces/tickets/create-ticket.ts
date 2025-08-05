import {TicketType} from '../../enums/tickets/ticket-type';

export interface CreateTicket {
  "userId": string,
  "areaId": string,
  "type": TicketType,
  "description": string
}
