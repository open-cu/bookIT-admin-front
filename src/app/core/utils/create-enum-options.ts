import {TypeUtils} from './type.utils';
import getEnumKeys = TypeUtils.getEnumKeys;

export function createEnumOptions<T extends object>(enumObj: T) {
  return getEnumKeys(enumObj).map(key => ({ value: key }));
}
