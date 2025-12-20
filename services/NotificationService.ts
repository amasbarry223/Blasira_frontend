import { NotificationHistoryItem } from '../models/Notification';

export class NotificationService {
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

  async getNotificationHistory(): Promise<NotificationHistoryItem[]> {
    const response = await fetch(`${this.baseUrl}/admin/notifications/history`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch notification history');
    }
    return response.json();
  }
}
