import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pageable} from '../../models/interfaces/pagination/pageable';

export type QueryParams = { [p: string]: string | number | boolean | readonly (string | number | boolean)[] };

@Injectable({
  providedIn: 'root'
})
export abstract class ApiService<T = void> {
  protected http = inject(HttpClient);
  protected abstract baseUrl: string;

  protected get(id: string) {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  protected getList(params?: any) {
    const httpParams = new HttpParams({fromObject: params as QueryParams});
    return this.http.get<Pageable<T>>(`${this.baseUrl}`, {params: httpParams});
  }

  protected post(item: any) {
    return this.http.post<T>(`${this.baseUrl}`, item);
  }

  protected patch(id: string, item: Partial<T>) {
    return this.http.patch<T>(`${this.baseUrl}/${id}`, item);
  }

  protected put(id: string, item: any) {
    return this.http.put<T>(`${this.baseUrl}/${id}`, item);
  }

  protected delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
