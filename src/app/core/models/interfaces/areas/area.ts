import {AreaType} from '../../enums/areas/area-type';
import {Image} from '../images/image';
import {AreaFeature} from '../../enums/areas/area-feature';

export interface Area {
  "id": string,
  "name": string,
  "description": string,
  "type": AreaType,
  "features": AreaFeature[],
  "images": Image[],
  "capacity": number,
}
