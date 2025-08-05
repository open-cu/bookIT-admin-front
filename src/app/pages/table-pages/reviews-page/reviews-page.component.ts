import {Component, inject} from '@angular/core';
import {TablePageComponent} from '../../../shared/common-ui/table-page/table-page.component';
import {Review} from '../../../core/models/interfaces/reviews/review';
import {ReviewsService} from '../../../core/services/api/reviews.service';
import {
  REVIEWS_COLUMNS_CONFIG,
  REVIEWS_CREATION_CONFIG,
  REVIEWS_DELETION_CONFIG,
  REVIEWS_FILTER_OPTIONS
} from './reviews.config';
import {SortReview} from '../../../core/models/interfaces/reviews/sort-review';
import {CreateReview} from '../../../core/models/interfaces/reviews/create-review';
import {markAsRequired} from '../../../shared/common-ui/creation-block/creation-config';

@Component({
  selector: 'app-reviews-page',
  imports: [
    TablePageComponent
  ],
  templateUrl: './reviews-page.component.html',
  styleUrl: './reviews-page.component.css'
})
export class ReviewsPageComponent extends TablePageComponent<Review> {
  override filterOptions = REVIEWS_FILTER_OPTIONS;
  override columns = REVIEWS_COLUMNS_CONFIG;
  override creationConfig = REVIEWS_CREATION_CONFIG;
  override deletionConfig = REVIEWS_DELETION_CONFIG;

  private reviewsService = inject(ReviewsService);

  constructor() {
    super();
    markAsRequired(this.creationConfig);
  }

  override loadItemsFn = (params: SortReview) => {
    return this.reviewsService.getList(params);
  }

  override createItemFn = (item: CreateReview) => {
    return this.reviewsService.post(item);
  }

  override deleteItemFn = (item: Review) => {
    return this.reviewsService.delete(item.id);
  }
}
