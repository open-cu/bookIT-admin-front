import {FilterOptions} from '../../shared/common-ui/filter-block/filter-config';
import {provideInjectable} from '../../core/providers/injector.provider';
import {AreaService} from '../../core/services/api/area.service';
import {map} from 'rxjs';

export const STATS_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'dates',
    type: 'dateRange',
    placeholder: 'Введите диапозон дат'
  },
  {
    key: 'areaNames',
    placeholder: 'Введите список помещений',
    type: 'multipleSelect',
    loadOptions: getAreaNamesOptions
  }
];

function getAreaNamesOptions() {
  return provideInjectable(AreaService)
    .getList()
    .pipe(
      map(res => res.content),
      map(res => res.map(area => ({value: area.name, label: area.name})))
    )
}
