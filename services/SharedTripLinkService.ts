import {
  SharedTripLink,
  CreateSharedTripLinkDto,
  UpdateSharedTripLinkDto,
} from '../models';

export class SharedTripLinkService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<SharedTripLink[]> {
    const response = await fetch(`${this.baseUrl}/shared-trip-links`);
    if (!response.ok) {
      throw new Error('Failed to fetch shared trip links');
    }
    return response.json();
  }

  async getById(id: number): Promise<SharedTripLink> {
    const response = await fetch(`${this.baseUrl}/shared-trip-links/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shared trip link with id ${id}`);
    }
    return response.json();
  }

  async getByToken(token: string): Promise<SharedTripLink> {
    const response = await fetch(`${this.baseUrl}/shared-trip-links/token/${token}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shared trip link with token ${token}`);
    }
    return response.json();
  }

  async getByTripId(tripId: number): Promise<SharedTripLink> {
    const response = await fetch(`${this.baseUrl}/shared-trip-links/trip/${tripId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shared trip link for trip ${tripId}`);
    }
    return response.json();
  }

  async create(data: CreateSharedTripLinkDto): Promise<SharedTripLink> {
    const response = await fetch(`${this.baseUrl}/shared-trip-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create shared trip link');
    }
    return response.json();
  }

  async update(id: number, data: UpdateSharedTripLinkDto): Promise<SharedTripLink> {
    const response = await fetch(`${this.baseUrl}/shared-trip-links/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update shared trip link with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/shared-trip-links/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete shared trip link with id ${id}`);
    }
  }
}

