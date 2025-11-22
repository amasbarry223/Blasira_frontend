import { DriverProfile, CreateDriverProfileDto, UpdateDriverProfileDto } from '../models';

export class DriverProfileService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<DriverProfile[]> {
    const response = await fetch(`${this.baseUrl}/driver-profiles`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver profiles');
    }
    return response.json();
  }

  async getById(id: number): Promise<DriverProfile> {
    const response = await fetch(`${this.baseUrl}/driver-profiles/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch driver profile with id ${id}`);
    }
    return response.json();
  }

  async create(data: CreateDriverProfileDto): Promise<DriverProfile> {
    const response = await fetch(`${this.baseUrl}/driver-profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create driver profile');
    }
    return response.json();
  }

  async update(id: number, data: UpdateDriverProfileDto): Promise<DriverProfile> {
    const response = await fetch(`${this.baseUrl}/driver-profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update driver profile with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/driver-profiles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete driver profile with id ${id}`);
    }
  }
}

