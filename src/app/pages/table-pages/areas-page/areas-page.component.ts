import {Component, inject} from '@angular/core';
import {TablePageComponent} from "../../../shared/common-ui/table-page/table-page.component";
import {Area} from '../../../core/models/interfaces/areas/area';
import {FilterResult} from '../../../shared/common-ui/filter-block/filter-config';
import {CreationConfig, markAsRequired} from '../../../shared/common-ui/creation-block/creation-config';
import {AreaService} from '../../../core/services/api/area.service';
import {SortArea} from '../../../core/models/interfaces/areas/sort-area';
import {
  AREAS_COLUMNS_CONFIG,
  AREAS_CREATION_CONFIG,
  AREAS_DELETION_CONFIG,
  AREAS_EDITION_CONFIG,
  AREAS_FILTER_OPTIONS,
  CreateAreaFlat,
  UpdateAreaFlat
} from './areas.config';
import {imageToFile} from '../../../core/utils/file-format.utils';
import {AreaStatus} from '../../../core/models/enums/areas/area-status';

@Component({
  selector: 'app-areas-page',
    imports: [
        TablePageComponent
    ],
  templateUrl: './areas-page.component.html',
  styleUrl: './areas-page.component.css'
})
export class AreasPageComponent extends TablePageComponent<Area> {
  override filterResult: FilterResult<typeof this.filterOptions> = {};
  override filterOptions = AREAS_FILTER_OPTIONS;
  override columns = AREAS_COLUMNS_CONFIG;
  override creationConfig = AREAS_CREATION_CONFIG
  override editionConfig = AREAS_EDITION_CONFIG;
  override deletionConfig = AREAS_DELETION_CONFIG;

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
    return this.areaService.post({createAreaRequest: {...area, status: AreaStatus[AreaStatus.AVAILABLE] }, photos});
  }

  override deleteItemFn = (item: Area) => {
    return this.areaService.delete(item.id);
  }

  override editItemFn = (item: Area, patch: UpdateAreaFlat) => {
    const { photos, ...area  } = patch;
    return this.areaService.put(item.id, {updateAreaRequest: area, photos});
  }

  override transformPatchFn = (config: CreationConfig, item: Area) => {
    let photos = config.options.find(option => option.key === 'photos');
    if (!photos) {
      return config;
    }
    photos.value = item.images.map(imageToFile);

    return config;
  }
}
