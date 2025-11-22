import { UserAccount, CreateUserAccountDto, UpdateUserAccountDto } from '../models';

export class UserAccountService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<UserAccount[]> {
    const response = await fetch(`${this.baseUrl}/user-accounts`);
    if (!response.ok) {
      throw new Error('Failed to fetch user accounts');
    }
    return response.json();
  }

  async getById(id: number): Promise<UserAccount> {
    const response = await fetch(`${this.baseUrl}/user-accounts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user account with id ${id}`);
    }
    return response.json();
  }

  async getByEmail(email: string): Promise<UserAccount> {
    const response = await fetch(`${this.baseUrl}/user-accounts/email/${email}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user account with email ${email}`);
    }
    return response.json();
  }

  async getByPhoneNumber(phoneNumber: string): Promise<UserAccount> {
    const response = await fetch(`${this.baseUrl}/user-accounts/phone/${phoneNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user account with phone ${phoneNumber}`);
    }
    return response.json();
  }

  async create(data: CreateUserAccountDto): Promise<UserAccount> {
    const response = await fetch(`${this.baseUrl}/user-accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create user account');
    }
    return response.json();
  }

  async update(id: number, data: UpdateUserAccountDto): Promise<UserAccount> {
    const response = await fetch(`${this.baseUrl}/user-accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user account with id ${id}`);
    }
    return response.json();
  }

  async verifyEmail(id: number): Promise<UserAccount> {
    const response = await fetch(`${this.baseUrl}/user-accounts/${id}/verify-email`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Failed to verify email for user account ${id}`);
    }
    return response.json();
  }

  async verifyPhone(id: number): Promise<UserAccount> {
    const response = await fetch(`${this.baseUrl}/user-accounts/${id}/verify-phone`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error(`Failed to verify phone for user account ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/user-accounts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user account with id ${id}`);
    }
  }
}

