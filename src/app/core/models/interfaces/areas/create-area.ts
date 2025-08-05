import {AreaType} from '../../enums/areas/area-type';
import {AreaFeature} from '../../enums/areas/area-feature';

export interface CreateArea {
  "createAreaRequest": {
    "name": string,
    "description": string,
    "type": AreaType,
    "features": AreaFeature[],
    "capacity": number,
    "status": string,
  },
  "photos": File[]
}
