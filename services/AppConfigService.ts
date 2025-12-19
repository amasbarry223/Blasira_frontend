import { AppConfig } from '../models';
import { getAuthHeaders } from '../lib/auth';

export class AppConfigService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async getSettings(): Promise<AppConfig> {
    const response = await fetch(`${this.baseUrl}/admin/settings`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    return response.json();
  }

  async updateSettings(settings: AppConfig): Promise<AppConfig> {
    const response = await fetch(`${this.baseUrl}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    return response.json();
  }
}