import {TicketType} from '../../enums/ticket-type';
import {SortPage} from '../pagination/sort-page';

export interface SortTicket extends SortPage {
  type: TicketType;
  startDate: string,
  endDate: string,
  search: string,
}
