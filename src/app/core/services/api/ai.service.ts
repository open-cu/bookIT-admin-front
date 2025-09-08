import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable, isDevMode} from '@angular/core';
import {AiRequest} from '../../models/interfaces/ai/ai-request';
import {delay, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);

  public readonly makeRequest: (request: AiRequest, humanize?: boolean) => Observable<string>;

  constructor() {
    this.makeRequest = isDevMode() ? this.makeRequestProd : this.makeRequestProd;
  }

  private makeRequestProd(request: AiRequest, humanize = false) {
    const httpParams = new HttpParams({ fromObject: { humanize } });
    return this.http.post('/api/ai', request, {
      responseType: 'text',
      params: httpParams,
    });
  }

  private makeRequestDev(request: AiRequest, humanize = false) {
    return of(`
        DevMode: ${isDevMode()}<br>
        Ваш запрос: \"${request.prompt}\"<br>
        humanize: ${humanize}<br>
      `).pipe(
      delay(Math.random() * 5000),
    );
  }
}
