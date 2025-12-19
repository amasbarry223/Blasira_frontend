import { Trip, CreateTripDto, UpdateTripDto } from '../models';
import { AdminTrip } from '../models/AdminTrip';

export class TripService {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string = '/api', token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private getAuthHeaders(): HeadersInit {
    if (this.token) {
      return {
        'Authorization': `Bearer ${this.token}`,
      };
    }
    return {};
  }

  async getAdminTrips(): Promise<AdminTrip[]> {
    const response = await fetch(`${this.baseUrl}/admin/trips`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch admin trips');
    }
    return response.json();
  }

  async getAll(): Promise<Trip[]> {
    const response = await fetch(`${this.baseUrl}/trips`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }
    return response.json();
  }

  async getById(id: number): Promise<Trip> {
    const response = await fetch(`${this.baseUrl}/trips/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch trip with id ${id}`);
    }
    return response.json();
  }

  async getByDriverId(driverId: number): Promise<Trip[]> {
    const response = await fetch(`${this.baseUrl}/trips/driver/${driverId}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch trips for driver ${driverId}`);
    }
    return response.json();
  }

  async getByVehicleId(vehicleId: number): Promise<Trip[]> {
    const response = await fetch(`${this.baseUrl}/trips/vehicle/${vehicleId}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch trips for vehicle ${vehicleId}`);
    }
    return response.json();
  }

  async search(
    departureAddress?: string,
    destinationAddress?: string,
    departureTime?: Date
  ): Promise<Trip[]> {
    const params = new URLSearchParams();
    if (departureAddress) params.append('departureAddress', departureAddress);
    if (destinationAddress) params.append('destinationAddress', destinationAddress);
    if (departureTime) params.append('departureTime', departureTime.toISOString());

    const response = await fetch(`${this.baseUrl}/trips/search?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to search trips');
    }
    return response.json();
  }

  async create(data: CreateTripDto): Promise<Trip> {
    const response = await fetch(`${this.baseUrl}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create trip');
    }
    return response.json();
  }

  async update(id: number, data: UpdateTripDto): Promise<Trip> {
    const response = await fetch(`${this.baseUrl}/trips/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update trip with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/trips/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete trip with id ${id}`);
    }
  }
}


