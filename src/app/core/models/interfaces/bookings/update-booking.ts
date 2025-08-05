import {BookingStatus} from '../../enums/bookings/booking-status';

export interface UpdateBooking {
  "userId": string,
  "areaId": string,
  "startTime": string,
  "endTime": string,
  "status": BookingStatus,
}
