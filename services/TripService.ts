import { Trip, CreateTripDto, UpdateTripDto } from '../models';

export class TripService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Trip[]> {
    const response = await fetch(`${this.baseUrl}/trips`);
    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }
    return response.json();
  }

  async getById(id: number): Promise<Trip> {
    const response = await fetch(`${this.baseUrl}/trips/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trip with id ${id}`);
    }
    return response.json();
  }

  async getByDriverId(driverId: number): Promise<Trip[]> {
    const response = await fetch(`${this.baseUrl}/trips/driver/${driverId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch trips for driver ${driverId}`);
    }
    return response.json();
  }

  async getByVehicleId(vehicleId: number): Promise<Trip[]> {
    const response = await fetch(`${this.baseUrl}/trips/vehicle/${vehicleId}`);
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

    const response = await fetch(`${this.baseUrl}/trips/search?${params.toString()}`);
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
    });
    if (!response.ok) {
      throw new Error(`Failed to delete trip with id ${id}`);
    }
  }
}

