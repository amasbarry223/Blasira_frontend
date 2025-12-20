import { Message, SendMessageRequest, UpdateMessageDto } from '../models';
import { getAuthHeaders } from '../lib/auth';

export class MessageService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Message[]> {
    const response = await fetch(`${this.baseUrl}/messages`);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return response.json();
  }

  async getById(id: number): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/messages/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch message with id ${id}`);
    }
    return response.json();
  }

  async getByConversationId(conversationId: number): Promise<Message[]> {
    const response = await fetch(`${this.baseUrl}/messages/conversation/${conversationId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages for conversation ${conversationId}`);
    }
    return response.json();
  }

  async getBySenderId(senderId: number): Promise<Message[]> {
    const response = await fetch(`${this.baseUrl}/messages/sender/${senderId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages for sender ${senderId}`);
    }
    return response.json();
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      // Try to parse error response
      const errorData = await response.json().catch(() => ({ message: 'Failed to send message' }));
      throw new Error(errorData.message || `Failed to send message: ${response.status}`);
    }
    return response.json();
  }

  async sendAdminBroadcastMessage(data: AdminBroadcastMessageRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to send broadcast message' }));
      throw new Error(errorData.message || `Failed to send broadcast message: ${response.status}`);
    }
    // Assuming no return body needed for a broadcast
  }

  async getAdminNotificationHistory(): Promise<NotificationHistoryItem[]> {
    const response = await fetch(`${this.baseUrl}/admin/notifications/history`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch notification history' }));
      throw new Error(errorData.message || `Failed to fetch notification history: ${response.status}`);
    }
    return response.json();
  }

  async update(id: number, data: UpdateMessageDto): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update message with id ${id}`);
    }
    return response.json();
  }

  async markAsRead(id: number): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/messages/${id}/read`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Failed to mark message ${id} as read`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/messages/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete message with id ${id}`);
    }
  }
}

