import { UserProfile, CreateUserProfileDto, UpdateUserProfileDto } from '../models';

export class UserProfileService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<UserProfile[]> {
    const response = await fetch(`${this.baseUrl}/user-profiles`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profiles');
    }
    return response.json();
  }

  async getById(id: number): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/user-profiles/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile with id ${id}`);
    }
    return response.json();
  }

  async create(data: CreateUserProfileDto): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/user-profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create user profile');
    }
    return response.json();
  }

  async update(id: number, data: UpdateUserProfileDto): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/user-profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user profile with id ${id}`);
    }
    return response.json();
  }

  async verifyStudent(id: number): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/user-profiles/${id}/verify-student`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Failed to verify student for user profile ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/user-profiles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user profile with id ${id}`);
    }
  }
}

