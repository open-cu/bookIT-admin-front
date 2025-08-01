export interface CreateBooking {
  "userId": string,
  "areaId": string,
  "timePeriods": [
    {
      "first": string,
      "second": string
    }
  ],
  "quantity": number
}
