import {
  Conversation,
  ConversationParticipant,
  CreateConversationDto,
  ConversationWithParticipants,
} from '../models';

export class ConversationService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Conversation[]> {
    const response = await fetch(`${this.baseUrl}/conversations`);
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return response.json();
  }

  async getById(id: number): Promise<ConversationWithParticipants> {
    const response = await fetch(`${this.baseUrl}/conversations/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch conversation with id ${id}`);
    }
    return response.json();
  }

  async getByUserId(userId: number): Promise<Conversation[]> {
    const response = await fetch(`${this.baseUrl}/conversations/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch conversations for user ${userId}`);
    }
    return response.json();
  }

  async create(data: CreateConversationDto): Promise<ConversationWithParticipants> {
    const response = await fetch(`${this.baseUrl}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }
    return response.json();
  }

  async addParticipant(
    conversationId: number,
    userProfileId: number
  ): Promise<ConversationParticipant> {
    const response = await fetch(
      `${this.baseUrl}/conversations/${conversationId}/participants`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userProfileId }),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to add participant to conversation');
    }
    return response.json();
  }

  async removeParticipant(conversationId: number, userProfileId: number): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/conversations/${conversationId}/participants/${userProfileId}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to remove participant from conversation');
    }
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/conversations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete conversation with id ${id}`);
    }
  }
}

