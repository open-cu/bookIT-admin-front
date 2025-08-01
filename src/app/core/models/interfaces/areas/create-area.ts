import {AreaType} from '../../enums/area-type';

export interface CreateArea {
  "createAreaRequest": {
    "name": string,
    "description": string,
    "type": AreaType,
    "features": string[],
    "capacity": number,
    "status": string,
  },
  "photos": File[]
}
