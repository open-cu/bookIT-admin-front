import {provideInjectable} from '../../core/providers/injector.provider';
import {UserService} from '../../core/services/api/auth/user.service';
import {map} from 'rxjs';
import {AreaService} from '../../core/services/api/area.service';
import {DatePipe} from '@angular/common';
import {BookingService} from '../../core/services/api/booking.service';

export function getMyId() {
  return provideInjectable(UserService)
    .getMe()
    .pipe(
      map(user => user.id)
    )
}

export function getAreaOptions() {
  return provideInjectable(AreaService)
    .getList()
    .pipe(
      map(res => res.content),
      map(res => res.map(area => ({value: area.id, label: area.name})))
    )
}

export function createTimeOptions(values: Record<string, any>) {
  const datePipe = provideInjectable(DatePipe);
  return provideInjectable(BookingService)
    .getAvailableTimes({
      date: datePipe.transform(values['date'], 'y-MM-dd')!,
      areaId: values['areaId'],
    })
    .pipe(
      map(arr => [...arr[0], ...arr[1], ...arr[2]]),
      map(arr => arr.map(time => ({
        value: time,
        label: time.split(';')
          .map(time => datePipe.transform(time, 'HH:mm'))
          .join('-')
      })))
    );
}
