import {BookingTimeline} from '../../enums/bookings/booking-timeline';
import {SortPage} from '../pagination/sort-page';

export interface SortBooking extends SortPage {
  timeline: BookingTimeline,
  areaId: string,
  userId: string,
  startTime: string,
  endTime: string,
}
