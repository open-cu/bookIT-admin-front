export interface EventOverlap {
  eventId1: string,
  eventName1: string,
  eventId2: string,
  eventName2: string,
  commonUsersCount: number,
  event1TotalUsers: number
  event2TotalUsers: number
  overlapPercentage: number,
}
