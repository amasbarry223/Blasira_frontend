import { Message, CreateMessageDto, UpdateMessageDto } from '../models';

export class MessageService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
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

  async create(data: CreateMessageDto): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create message');
    }
    return response.json();
  }

  async update(id: number, data: UpdateMessageDto): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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

