import {Component, inject} from '@angular/core';
import {TablePageComponent} from "../../shared/common-ui/table-page/table-page.component";
import {Ticket} from '../../core/models/interfaces/tickets/ticket';
import {Area} from '../../core/models/interfaces/areas/area';
import {FilterResult} from '../../shared/common-ui/filter-block/filter-config';
import {markAsRequired} from '../../shared/common-ui/creation-block/creation-config';
import {AreaService} from '../../core/services/api/area.service';
import {SortArea} from '../../core/models/interfaces/areas/sort-area';
import {
  AREA_COLUMNS_CONFIG,
  AREA_CREATION_CONFIG,
  AREA_DELETION_CONFIG,
  AREA_EDITION_CONFIG,
  AREA_FILTER_OPTIONS,
  CreateAreaFlat,
  UpdateAreaFlat
} from './area.config';

@Component({
  selector: 'app-area-page',
    imports: [
        TablePageComponent
    ],
  templateUrl: './area-page.component.html',
  styleUrl: './area-page.component.css'
})
export class AreaPageComponent extends TablePageComponent<Area>  {
  override filterResult: FilterResult<typeof this.filterOptions> = {};
  override filterOptions = AREA_FILTER_OPTIONS;
  override columns = AREA_COLUMNS_CONFIG;
  override creationConfig = AREA_CREATION_CONFIG
  override editionConfig = AREA_EDITION_CONFIG;
  override deletionConfig = AREA_DELETION_CONFIG;

  private areaService = inject(AreaService);

  constructor() {
    super();
    markAsRequired(this.creationConfig, ['features', 'photos']);
  }

  override loadItemsFn = (params: Partial<SortArea>) => {
    return this.areaService.getList(params);
  }

  override createItemFn = (item: CreateAreaFlat) => {
    const { photos, ...area  } = item;
    return this.areaService.post({createAreaRequest: area, photos});
  }

  override deleteItemFn = (item: Ticket) => {
    return this.areaService.delete(item.id);
  }

  override editItemFn = (item: any, patch: UpdateAreaFlat) => {
    const { photos, ...area  } = patch;
    return this.areaService.put(item['id'], {updateAreaRequest: area, photos});
  }
}
