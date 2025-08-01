import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pageable} from '../../models/interfaces/pagination/pageable';
import {TypeUtils} from '../../utils/type.utils';
import toArray = TypeUtils.toArray;

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
    return this.http.delete(`${this.baseUrl}/${id}`, {responseType: 'text'});
  }

  protected convertToFormData<T extends object>(
    object: T,
    keys: (keyof T)[] | (keyof T) = []
  ): FormData {
    const formData = new FormData();
    const keysArray = toArray(keys);

    for (const [key, value] of Object.entries(object)) {
      if (keysArray.includes(key as keyof T)) continue;

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    }

    keysArray.forEach(fileKey => {
      const files = object[fileKey];
      if (Array.isArray(files)) {
        files.forEach(file => {
          if (file instanceof File) {
            formData.append(fileKey as string, file, file.name);
          }
        });
      } else if (files instanceof File) {
        formData.set(fileKey as string, files, files.name);
      }
    });

    return formData;
  }
}
