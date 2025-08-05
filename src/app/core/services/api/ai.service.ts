import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {AiRequest} from '../../models/interfaces/ai/ai-request';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);

  makeRequest(request: AiRequest, humanize = false) {
    const httpParams = new HttpParams({ fromObject: { humanize } });
    return this.http.post('/api/ai', request, {
      responseType: 'text',
      params: httpParams,
    });
  }
}
