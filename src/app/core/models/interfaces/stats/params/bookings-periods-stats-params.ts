import {StatsPeriod} from '../../../enums/stats/stats-period';

export interface BookingsPeriodsStatsParams {
  period: StatsPeriod,
  areaNames?: string[],
  includeSummary?: boolean
}
