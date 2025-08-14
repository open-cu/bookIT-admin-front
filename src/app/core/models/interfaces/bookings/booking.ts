import {BookingStatus} from '../../enums/bookings/booking-status';

export interface Booking {
  "id": string,
  "userId": string,
  "areaId": string,
  "startTime": string,
  "endTime": string,
  "quantity": number,
  "status": BookingStatus,
  "createdAt": string
}
