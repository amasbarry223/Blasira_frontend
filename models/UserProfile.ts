export interface UserProfile {
  id: number;
  bio: string | null;
  firstName: string;
  lastName: string;
  memberSince: Date | null;
  profilePictureUrl: string | null;
  studentVerified: boolean;
}

export interface CreateUserProfileDto {
  id: number; // Must match user_accounts.id
  bio?: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  studentVerified?: boolean;
}

export interface UpdateUserProfileDto {
  bio?: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  studentVerified?: boolean;
}

