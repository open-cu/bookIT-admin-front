import {TicketType} from '../../enums/ticket-type';

export interface CreateTicket {
  "userId": string,
  "areaId": string,
  "type": TicketType,
  "description": string
}
