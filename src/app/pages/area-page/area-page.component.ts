import {Component, inject} from '@angular/core';
import {TablePageComponent} from "../../shared/common-ui/table-page/table-page.component";
import {Ticket} from '../../core/models/interfaces/tickets/ticket';
import {Area} from '../../core/models/interfaces/areas/area';
import {FilterOptions, FilterResult} from '../../shared/common-ui/filter-block/filter-config';
import {CreationConfig} from '../../shared/common-ui/creation-block/creation-config';
import {TypeUtils} from '../../core/utils/type.utils';
import getEnumKeys = TypeUtils.getEnumKeys;
import {AreaType} from '../../core/models/enums/area-type';
import {AreaService} from '../../core/services/api/area.service';
import {SortArea} from '../../core/models/interfaces/areas/sort-area';
import {CreateArea} from '../../core/models/interfaces/areas/create-area';
import {UpdateArea} from '../../core/models/interfaces/areas/update-area';
import {AREA_COLUMNS_CONFIG, AREA_FILTER_OPTIONS} from './area-columns.config';

@Component({
  selector: 'app-area-page',
    imports: [
        TablePageComponent
    ],
  templateUrl: './area-page.component.html',
  styleUrl: './area-page.component.css'
})
export class AreaPageComponent extends TablePageComponent<Area>  {
  override filterOptions: FilterOptions = AREA_FILTER_OPTIONS;
  override filterResult: FilterResult<typeof this.filterOptions> = {};

  override creationConfig: CreationConfig = {
    button: 'Создать помещение',
    title: 'Создание помещение',
    options: [
      {key: 'userId'},
      {key: 'areaId'},
      {
        key: 'type',
        type: 'select',
        options: getEnumKeys(AreaType).map(key => ({value: key})),
      },
      {key: 'description'},
    ],
  };

  override columns = AREA_COLUMNS_CONFIG;

  private areaService = inject(AreaService);

  constructor() {
    super();
  }

  override loadItemsFn = (params: Partial<SortArea>) => {
    return this.areaService.getList(params);
  }

  override createItemFn = (item: CreateArea) => {
    return this.areaService.post(item);
  }

  override deleteItemFn = (item: Ticket) => {
    return this.areaService.delete(item.id);
  }

  override editItemFn = (id: string, item: UpdateArea) => {
    return this.areaService.put(id, item);
  }
}
