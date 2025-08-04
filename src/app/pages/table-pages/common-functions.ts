import {provideInjectable} from '../../core/providers/injector.provider';
import {UserService} from '../../core/services/api/auth/user.service';
import {map} from 'rxjs';
import {AreaService} from '../../core/services/api/area.service';
import {DatePipe} from '@angular/common';
import {BookingService} from '../../core/services/api/booking.service';
import {CreationConfig, CreationOption} from '../../shared/common-ui/creation-block/creation-config';
import {findIndex} from 'lodash';
import {TuiTime} from '@taiga-ui/cdk';
import {imageToFile} from '../../core/utils/file-format.utils';
import {Image} from '../../core/models/interfaces/images/image';
import {UserStatus} from '../../core/models/enums/users/user-status';

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

export function findIndexByKey(config: CreationConfig, key: string) {
  return findIndex(config.options, (option: CreationOption) => option.key === key);
}

export function patchItemWithTime(config: CreationConfig, item: { startTime: string, endTime: string }) {
  const dateIndex = findIndexByKey(config, 'date');
  const startIndex = findIndexByKey(config, 'startTime');
  const endIndex = findIndexByKey(config, 'endTime');
  if (dateIndex < 0 || startIndex < 0 || endIndex < 0) {
    return config;
  }
  config.options[dateIndex].value = new Date(item.startTime);
  config.options[startIndex].value = TuiTime.fromLocalNativeDate(new Date(item.startTime));
  config.options[endIndex].value = TuiTime.fromLocalNativeDate(new Date(item.endTime));
  return config;
}

export function patchItemWithImages(config: CreationConfig, item: {images: Image[]}) {
  let photosIndex = findIndexByKey(config, 'photos');
  if (photosIndex < 0) {
    return config;
  }
  config.options[photosIndex].value = item.images.map(imageToFile);
  return config;
}

export function patchUserStatus(config: CreationConfig, item: {status: UserStatus}) {
  const statusIndex = findIndexByKey(config, 'userStatus');
  if (statusIndex < 0) {
    return config;
  }
  config.options[statusIndex].value = item.status;
  return config;
}
