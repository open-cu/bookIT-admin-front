import {computed, CreateComputedOptions, isSignal, Signal, untracked} from '@angular/core';
import {Filter, FilterOptions, FilterSignals} from './filter.types';
import {isObject} from 'lodash';

export function getValue<T>(maybeSignal: Signal<T> | T, tracking = true) {
  return isSignal(maybeSignal)
    ? (tracking
      ? maybeSignal()
      : untracked(() => maybeSignal()))
    : maybeSignal;
}

export function createFilter(
  filter: FilterSignals,
  options?: CreateComputedOptions<FilterOptions>,
) {
  const map = new Map<string, any>();
  const singleSignal = computed(() => {
    for (let [key, value] of filter.entries()) {
      map.set(key, value());
    }
    return map as ReadonlyMap<string, any>;
  }, {...options, equal: () => false});

  return {
    ...Object.fromEntries(filter.entries()),
    get: (key: string) => filter.get(key),
    has: (key: string) => filter.has(key),
    forEach: (callback) => filter.forEach(callback),
    entries: () => filter.entries(),
    keys: () => filter.keys(),
    values: () => filter.values(),
    size: filter.size,
    [Symbol.iterator]: () => filter[Symbol.iterator](),
    asSignal: () => singleSignal
  } as Filter;
}

export function convertValueToString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (isObject(value)) {
    return JSON.stringify(value);
  }
  return String(value);
}

export function parseSingleValue(value: string, example?: any): any {
  try {
    return JSON.parse(value);
  } catch {
    if (example !== undefined) {
      if (typeof example === 'number') {
        return Number(value);
      }
      if (typeof example === 'boolean') {
        return value === 'true';
      }
    }
    return value;
  }
}
