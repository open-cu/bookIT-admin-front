import {AreaStats} from './area-stats';

export interface StatsSummary {
  totalBookings: number,
  mostPopularArea: string,
  maxBookingsInDay: number,
  peakDate: string,
  areaStats: AreaStats[],
}
