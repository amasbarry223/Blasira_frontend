export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  note: number;
  nombreDeTrajet: number;
}

export interface AdminUserResponse {
  users: AdminUser[];
  total?: number;
}

