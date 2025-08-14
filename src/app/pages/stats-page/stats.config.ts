import {FilterOptions} from '../../shared/common-ui/filter-block/filter-config';
import {provideInjectable} from '../../core/providers/injector.provider';
import {AreaService} from '../../core/services/api/area.service';
import {map} from 'rxjs';
import {createEnumOptions} from '../../core/utils/create-enum-options';
import {StatsPeriod} from '../../core/models/enums/stats/stats-period';

export const STATS_FILTER_OPTIONS: FilterOptions = [
  {
    key: 'dates',
    type: 'dateRange',
    placeholder: 'Выберите диапозон дат'
  },
  {
    key: 'areaNames',
    placeholder: 'Выберите список помещений',
    type: 'multipleSelect',
    loadOptions: getAreaNamesOptions
  },
  {
    key: 'period',
    type: 'select',
    placeholder: 'Выберите период времени',
    options: createEnumOptions(StatsPeriod)
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
