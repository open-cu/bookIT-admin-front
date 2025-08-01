import {AreaType} from '../../enums/area-type';

export interface UpdateArea {
  "updateAreaRequest": {
    "name": string,
    "type": AreaType,
    "capacity": number
  },
  "photos": File[]
}
