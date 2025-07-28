import {Component, inject} from '@angular/core';
import {FilterBlockComponent} from "../../shared/common-ui/filter-block/filter-block.component";
import {TablePageComponent} from "../../shared/common-ui/table-page/table-page.component";
import {TuiButton} from "@taiga-ui/core";
import {Area} from '../../core/models/interfaces/areas/area';
import {AreaService} from '../../core/services/api/area.service';
import {SortArea} from '../../core/models/interfaces/areas/sort-area';
import {AREA_COLUMNS_CONFIG} from './area-columns.config';

@Component({
  selector: 'app-area-page',
    imports: [
        FilterBlockComponent,
        TablePageComponent,
        TuiButton
    ],
  templateUrl: './area-page.component.html',
  styleUrl: './area-page.component.css'
})
export class AreaPageComponent extends TablePageComponent<Area> {
  protected fields: Record<string, string> = {
    type: '',
    search: '',
  };
  protected fieldsPlaceholders: Record<keyof typeof this.fields, string> = {
    type: 'По типу',
    search: 'По названию',
  }
  protected readonly AREA_COLUMNS_CONFIG = AREA_COLUMNS_CONFIG;

  private areaService = inject(AreaService);

  protected fetchItems = (params: Partial<SortArea>) => {
    return this.areaService.getList(params);
  }
}
