import { UserRole as UserRoleEnum } from './enums';

export interface UserRole {
  userId: number;
  roles: UserRoleEnum;
}

export interface CreateUserRoleDto {
  userId: number;
  roles: UserRoleEnum;
}

export interface UserWithRoles {
  userId: number;
  roles: UserRoleEnum[];
}

