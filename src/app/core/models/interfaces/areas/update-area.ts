import {AreaType} from '../../enums/areas/area-type';

export interface UpdateArea {
  "updateAreaRequest": {
    "name": string,
    "type": AreaType,
    "capacity": number
  },
  "photos": File[]
}
