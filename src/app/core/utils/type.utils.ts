import _ from 'lodash';
import {isIterable} from 'rxjs/internal/util/isIterable';

export namespace TypeUtils {
  export function toSet<T>(value: Set<T> | T[] | T | undefined | null): Set<T> {
    if (!value) {
      return new Set<T>();
    }
    return new Set<T>(toArray(value));
  }

  export function toArray<T>(value: T | T[] | Set<T> | null | undefined): T[] {
    if (!value) {
      return [];
    }
    return _.isArray(value) || _.isSet(value) ? [...value] : [value];
  }

  const toStringConverter = {
    "string": (source: string[] | string) => String(source as string),
    "number": (source: string[] | string) => Number(source as string),
    "bigint": (source: string[] | string) => BigInt(source as string),
    "null": () => null,
    "undefined": () => undefined,
    "function": (source: string[] | string) => Function(source as string),
    "boolean": (source: string[] | string) => Boolean(source as string),
    "symbol": (source: string[] | string) => Symbol(source as string),
    "object": (source: string[] | string, target: any) => createObjectFromString(source, target),
  }

  export function createFromString(source: string[] | string, target: any): any {
    return toStringConverter[typeOf(target) as keyof typeof toStringConverter](source, target);
  }

  export function isCollection(value: any) {
    return !_.isString(value) && isIterable(value);
  }

  export function createObjectFromString(source: string[] | string, target: any): any {
    if (typeOf(target) !== 'object') {
      throw new Error('Target type must be an object');
    }
    const ctor = target.constructor;
    if (ctor === Object) {
      return {};
    }
    if (ctor === Array) {
      return _.isArray(source) ? [...source] : [source];
    }
    if (ctor === Date) {
      const str = _.isArray(source) ? source.join(' ') : source;
      const date = new Date(str);
      if (_.isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${str}`);
      }
      return date;
    }

    if (ctor === RegExp) {
      const arr = _.isArray(source) ? [...source] : source === '' ? [] : [source];
      if (arr.length == 0 || arr.length > 2) {
        throw new Error(`Invalid regexp: ${arr[0]} with flags: ${arr[1]}`);
      }
      return new RegExp(arr[0], arr[1]);
    }

    const result = new ctor(_.isArray(source) ? [...source] : [source]);
    if (result !== null) {
      return result;
    }
    throw new Error(`Cannot create an object of type [${ctor.name}]`);
  }

  export function typeOf(value: any) {
    return value === null ? 'null' : typeof value;
  }

  export function getByKey(obj: object, key: any): any {
    return obj[key as keyof typeof obj];
  }

  export function objToMap(obj: object) {
    return new Map<string, any>(Object.entries(obj));
  }

  type EnumKeys<T> = Exclude<keyof T, number>;

  export function getEnumKeys<T extends object>(enumObj: T): EnumKeys<T>[] {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key))) as EnumKeys<T>[];
  }

  export function compactObject<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key as keyof T] = value;
      }
      return acc;
    }, {} as Partial<T>);
  }

  export function getSelf<T>(value: T): T {
    return value;
  }

  export function transformParam<T, U extends any[], R>(
    targetFn: (...args: U) => R,
    transform: (value: T) => T,
    paramIndex: number = 0,
  ): (...args: U) => R {
    return (...args: U): R => {
      if (paramIndex < 0 || paramIndex >= args.length) {
        throw new Error(`Invalid parameter index: ${paramIndex}`);
      }

      const newArgs = [...args] as U;

      newArgs[paramIndex] = transform(newArgs[paramIndex] as unknown as T) as unknown as U[typeof paramIndex];

      return targetFn(...newArgs);
    };
  }
}
