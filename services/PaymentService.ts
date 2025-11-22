import { Payment, CreatePaymentDto, UpdatePaymentDto } from '../models';

export class PaymentService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Payment[]> {
    const response = await fetch(`${this.baseUrl}/payments`);
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    return response.json();
  }

  async getById(id: number): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/payments/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch payment with id ${id}`);
    }
    return response.json();
  }

  async getByBookingId(bookingId: number): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/payments/booking/${bookingId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch payment for booking ${bookingId}`);
    }
    return response.json();
  }

  async create(data: CreatePaymentDto): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create payment');
    }
    return response.json();
  }

  async update(id: number, data: UpdatePaymentDto): Promise<Payment> {
    const response = await fetch(`${this.baseUrl}/payments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update payment with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/payments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete payment with id ${id}`);
    }
  }
}

