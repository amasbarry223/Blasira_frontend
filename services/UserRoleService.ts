import { UserRole, CreateUserRoleDto, UserWithRoles } from '../models';

export class UserRoleService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<UserRole[]> {
    const response = await fetch(`${this.baseUrl}/user-roles`);
    if (!response.ok) {
      throw new Error('Failed to fetch user roles');
    }
    return response.json();
  }

  async getByUserId(userId: number): Promise<UserWithRoles> {
    const response = await fetch(`${this.baseUrl}/user-roles/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user roles for user ${userId}`);
    }
    return response.json();
  }

  async create(data: CreateUserRoleDto): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/user-roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create user role');
    }
    return response.json();
  }

  async addRole(userId: number, role: string): Promise<UserRole> {
    const response = await fetch(`${this.baseUrl}/user-roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, roles: role }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add role to user ${userId}`);
    }
    return response.json();
  }

  async removeRole(userId: number, role: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/user-roles/user/${userId}/role/${role}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to remove role from user ${userId}`);
    }
  }

  async delete(userId: number, role: string): Promise<void> {
    await this.removeRole(userId, role);
  }
}

