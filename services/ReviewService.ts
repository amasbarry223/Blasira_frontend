import { Review, CreateReviewDto, UpdateReviewDto } from '../models';

export class ReviewService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Review[]> {
    const response = await fetch(`${this.baseUrl}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  }

  async getById(id: number): Promise<Review> {
    const response = await fetch(`${this.baseUrl}/reviews/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch review with id ${id}`);
    }
    return response.json();
  }

  async getByBookingId(bookingId: number): Promise<Review> {
    const response = await fetch(`${this.baseUrl}/reviews/booking/${bookingId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch review for booking ${bookingId}`);
    }
    return response.json();
  }

  async getByRecipientId(recipientId: number): Promise<Review[]> {
    const response = await fetch(`${this.baseUrl}/reviews/recipient/${recipientId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews for recipient ${recipientId}`);
    }
    return response.json();
  }

  async getByAuthorId(authorId: number): Promise<Review[]> {
    const response = await fetch(`${this.baseUrl}/reviews/author/${authorId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews by author ${authorId}`);
    }
    return response.json();
  }

  async create(data: CreateReviewDto): Promise<Review> {
    const response = await fetch(`${this.baseUrl}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create review');
    }
    return response.json();
  }

  async update(id: number, data: UpdateReviewDto): Promise<Review> {
    const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update review with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/reviews/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete review with id ${id}`);
    }
  }
}

