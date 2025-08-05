import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Review} from '../../models/interfaces/reviews/review';
import {SortReview} from '../../models/interfaces/reviews/sort-review';
import {CreateReview} from '../../models/interfaces/reviews/create-review';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService extends ApiService<Review> {
  protected override baseUrl = '/api/reviews';

  override delete(reviewId: string) {
    return super.delete(reviewId);
  }

  override get(reviewId: string) {
    return super.get(reviewId);
  }

  override getList(params?: Partial<SortReview>) {
    return super.getList(params);
  }

  override post(review: CreateReview) {
    return super.post(review);
  }
}
