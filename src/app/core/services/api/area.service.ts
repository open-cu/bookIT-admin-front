import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {Area} from '../../models/interfaces/areas/area';
import {SortArea} from '../../models/interfaces/areas/sort-area';
import {CreateArea} from '../../models/interfaces/areas/create-area';
import {UpdateArea} from '../../models/interfaces/areas/update-area';

@Injectable({
  providedIn: 'root'
})
export class AreaService extends ApiService<Area> {
  protected override baseUrl = '/api/area';

  override delete(areaId: string) {
    return super.delete(areaId);
  }

  override get(areaId: string) {
    return super.get(areaId);
  }

  override getList(params?: Partial<SortArea>) {
    return super.getList(params);
  }

  override post(area: CreateArea) {
    return super.post(area);
  }

  override put(areaId: string, area: UpdateArea) {
    return super.put(areaId, area);
  }
}
