import {Signal, WritableSignal} from '@angular/core';

export type FilterOptions = {
  [key: string]: {
    initial?: any,
    fromQuery?: FromQueryConverter,
    toQuery?: ToQueryConverter,
  }
};

export type FilterAsSignal = Signal<ReadonlyMap<string, any>>;
export type FilterSignals = ReadonlyMap<string, WritableSignal<any>>;
export type Filter = FilterSignals & { asSignal(): FilterAsSignal };

export type ToQueryConverter = (value: any) => string | string[] | undefined;
export type FromQueryConverter = (value: string | string[]) => any;
