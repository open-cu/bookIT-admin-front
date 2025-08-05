import {BookingStats} from './booking-stats';
import {StatsSummary} from './stats-summary';

export interface FullStats {
  stats: BookingStats[],
  summary: StatsSummary,
}
