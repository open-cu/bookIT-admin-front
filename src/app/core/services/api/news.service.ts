import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {News} from '../../models/interfaces/news/news';
import {SortNews} from '../../models/interfaces/news/sort-news';
import {CreateNews} from '../../models/interfaces/news/create-news';
import {UpdateNews} from '../../models/interfaces/news/update-news';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends ApiService<News> {
  protected override baseUrl = '/api/news';

  override delete(newsId: string) {
    return super.delete(newsId);
  }

  override get(newsId: string) {
    return super.get(newsId);
  }

  override getList(params?: Partial<SortNews>) {
    return super.getList(params);
  }

  override post(event: CreateNews) {
    return super.post(this.convertToFormData(event, 'photos'));
  }

  override put(newsId: string, event: UpdateNews) {
    return super.put(newsId, this.convertToFormData(event, 'photos'));
  }
}
