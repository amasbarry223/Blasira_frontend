import { Booking, CreateBookingDto, UpdateBookingDto } from '../models';

export class BookingService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Booking[]> {
    const response = await fetch(`${this.baseUrl}/bookings`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  }

  async getById(id: number): Promise<Booking> {
    const response = await fetch(`${this.baseUrl}/bookings/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch booking with id ${id}`);
    }
    return response.json();
  }

  async getByPassengerId(passengerId: number): Promise<Booking[]> {
    const response = await fetch(`${this.baseUrl}/bookings/passenger/${passengerId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings for passenger ${passengerId}`);
    }
    return response.json();
  }

  async getByTripId(tripId: number): Promise<Booking[]> {
    const response = await fetch(`${this.baseUrl}/bookings/trip/${tripId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings for trip ${tripId}`);
    }
    return response.json();
  }

  async create(data: CreateBookingDto): Promise<Booking> {
    const response = await fetch(`${this.baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    return response.json();
  }

  async update(id: number, data: UpdateBookingDto): Promise<Booking> {
    const response = await fetch(`${this.baseUrl}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update booking with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete booking with id ${id}`);
    }
  }
}

