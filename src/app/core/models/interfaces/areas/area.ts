import {AreaType} from '../../enums/area-type';
import {Image} from '../images/image';

export interface Area {
  "id": string,
  "name": string,
  "description": string,
  "type": AreaType,
  "features": string[],
  "images": Image[],
  "capacity": number,
}
