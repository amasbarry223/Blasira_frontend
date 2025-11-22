import { ReviewType } from './enums';

export interface Review {
  id: number;
  comment: string | null;
  createdAt: Date | null;
  rating: number;
  reviewType: ReviewType;
  authorId: number;
  bookingId: number;
  recipientId: number;
}

export interface CreateReviewDto {
  comment?: string;
  rating: number;
  reviewType: ReviewType;
  authorId: number;
  bookingId: number;
  recipientId: number;
}

export interface UpdateReviewDto {
  comment?: string;
  rating?: number;
}

