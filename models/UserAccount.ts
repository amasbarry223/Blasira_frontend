export interface UserAccount {
  id: number;
  createdAt: Date | null;
  email: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  password: string;
  phoneNumber: string;
  trustCharterAcceptedAt: Date | null;
  updatedAt: Date | null;
}

export interface CreateUserAccountDto {
  email: string;
  password: string;
  phoneNumber: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  trustCharterAcceptedAt?: Date;
}

export interface UpdateUserAccountDto {
  email?: string;
  password?: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  trustCharterAcceptedAt?: Date;
}

