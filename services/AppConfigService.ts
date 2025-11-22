import { AppConfig, CreateAppConfigDto, UpdateAppConfigDto } from '../models';

export class AppConfigService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<AppConfig[]> {
    const response = await fetch(`${this.baseUrl}/app-config`);
    if (!response.ok) {
      throw new Error('Failed to fetch app configs');
    }
    return response.json();
  }

  async getById(id: number): Promise<AppConfig> {
    const response = await fetch(`${this.baseUrl}/app-config/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch app config with id ${id}`);
    }
    return response.json();
  }

  async create(data: CreateAppConfigDto): Promise<AppConfig> {
    const response = await fetch(`${this.baseUrl}/app-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create app config');
    }
    return response.json();
  }

  async update(id: number, data: UpdateAppConfigDto): Promise<AppConfig> {
    const response = await fetch(`${this.baseUrl}/app-config/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update app config with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/app-config/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete app config with id ${id}`);
    }
  }
}

