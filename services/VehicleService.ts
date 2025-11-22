import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '../models';

export class VehicleService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Vehicle[]> {
    const response = await fetch(`${this.baseUrl}/vehicles`);
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }
    return response.json();
  }

  async getById(id: number): Promise<Vehicle> {
    const response = await fetch(`${this.baseUrl}/vehicles/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle with id ${id}`);
    }
    return response.json();
  }

  async getByOwnerId(ownerUserId: number): Promise<Vehicle[]> {
    const response = await fetch(`${this.baseUrl}/vehicles/owner/${ownerUserId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles for owner ${ownerUserId}`);
    }
    return response.json();
  }

  async getByLicensePlate(licensePlate: string): Promise<Vehicle> {
    const response = await fetch(`${this.baseUrl}/vehicles/license/${licensePlate}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle with license plate ${licensePlate}`);
    }
    return response.json();
  }

  async create(data: CreateVehicleDto): Promise<Vehicle> {
    const response = await fetch(`${this.baseUrl}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create vehicle');
    }
    return response.json();
  }

  async update(id: number, data: UpdateVehicleDto): Promise<Vehicle> {
    const response = await fetch(`${this.baseUrl}/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update vehicle with id ${id}`);
    }
    return response.json();
  }

  async verify(id: number): Promise<Vehicle> {
    const response = await fetch(`${this.baseUrl}/vehicles/${id}/verify`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Failed to verify vehicle ${id}`);
    }
    return response.json();
  }

  async reject(id: number): Promise<Vehicle> {
    const response = await fetch(`${this.baseUrl}/vehicles/${id}/reject`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Failed to reject vehicle ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/vehicles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete vehicle with id ${id}`);
    }
  }
}

