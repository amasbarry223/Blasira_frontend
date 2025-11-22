export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AdminUserResponse {
  users: AdminUser[];
  total?: number;
}

