import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable, isDevMode} from '@angular/core';
import {AiRequest} from '../../models/interfaces/ai/ai-request';
import {delay, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);

  makeRequest(request: AiRequest, humanize = false) {
    if (isDevMode()) {
      return of(`
        DevMode: ${isDevMode()}\n
        Ваш запрос: \"${request.prompt}\"\n
        humanize: ${humanize}\n
      `).pipe(
        delay(Math.random() * 5000),
      );
    }

    const httpParams = new HttpParams({ fromObject: { humanize } });
    return this.http.post('/api/ai', request, {
      responseType: 'text',
      params: httpParams,
    });
  }
}
