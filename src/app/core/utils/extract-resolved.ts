import {inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, Observable} from 'rxjs';

export function extractResolved<T>(dataKey: string | symbol, fromSnapshot: true): T;
export function extractResolved<T>(dataKey: string | symbol, fromSnapshot: false): Observable<T>;
export function extractResolved<T>(dataKey: string | symbol, fromSnapshot?: boolean): T | Observable<T>;

export function extractResolved<T>(dataKey: string | symbol, fromSnapshot = true): T | Observable<T> {
  const activatedRoute = inject(ActivatedRoute);
  if (!activatedRoute) {
    throw new Error('extractResolved must be called from injection context');
  }
  return fromSnapshot
    ? activatedRoute.snapshot.data[dataKey]
    : activatedRoute.data.pipe(map(data => data[dataKey]));
}
