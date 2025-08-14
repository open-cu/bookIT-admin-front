import {Component, inject} from '@angular/core';
import {markAsRequired} from '../../../shared/common-ui/creation-block/creation-config';
import {TablePageComponent} from '../../../shared/common-ui/table-page/table-page.component';
import {News} from '../../../core/models/interfaces/news/news';
import {
  CreateNewsFlat,
  NEWS_COLUMNS_CONFIG,
  NEWS_CREATION_CONFIG,
  NEWS_DELETION_CONFIG,
  NEWS_EDITION_CONFIG,
  NEWS_FILTER_OPTIONS,
  UpdateNewsFlat
} from './news.config';
import {NewsService} from '../../../core/services/api/news.service';
import {SortNews} from '../../../core/models/interfaces/news/sort-news';

@Component({
  selector: 'app-news-page',
  imports: [
    TablePageComponent
  ],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css'
})
export class NewsPageComponent extends TablePageComponent<News> {
  override filterOptions = NEWS_FILTER_OPTIONS;
  override columns = NEWS_COLUMNS_CONFIG;
  override creationConfig = NEWS_CREATION_CONFIG
  override editionConfig = NEWS_EDITION_CONFIG;
  override deletionConfig = NEWS_DELETION_CONFIG;

  private newsService = inject(NewsService);

  constructor() {
    super();
    markAsRequired(this.creationConfig, 'tags');
    markAsRequired(this.creationConfig, 'tags');
  }

  override loadItemsFn = (params: SortNews) => {
    params.sort = 'createdAt,asc';
    return this.newsService.getList(params);
  }

  override createItemFn = (item: CreateNewsFlat) => {
    const { photos, ...news } = item;
    return this.newsService.post({
      newsUpdateRequest: {
        ...news,
      },
      photos
    });
  }

  override deleteItemFn = (item: News) => {
    return this.newsService.delete(item.id);
  }

  override editItemFn = (item: News, update: UpdateNewsFlat) => {
    const {photos, ...result} = update;
    return this.newsService.put(item.id, {
      newsUpdateRequest: {
        ...result,
      },
      photos
    });
  }
}
