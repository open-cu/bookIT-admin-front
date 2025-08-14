export type TimeUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';

export function convertTime(time: number, from: TimeUnit = 'milliseconds', to: TimeUnit = 'milliseconds') {
  return time * TimeUnitValue[from] / TimeUnitValue[to];
}

const TimeUnitValue: Record<TimeUnit, number> = {
  'milliseconds': 1,
  'seconds': 1000,
  'minutes': 60 * 1000,
  'hours': 60 * 60 * 1000,
  'days': 24 * 60 * 60 * 1000,
};
