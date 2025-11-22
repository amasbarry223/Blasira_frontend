import { DriverProfileStatus } from './enums';

export interface DriverProfile {
  id: number;
  averageRating: number | null;
  ratingSum: number;
  reviewCount: number;
  status: DriverProfileStatus;
  totalTripsDriven: number;
}

export interface CreateDriverProfileDto {
  id: number; // Must match user_accounts.id
  status?: DriverProfileStatus;
}

export interface UpdateDriverProfileDto {
  averageRating?: number;
  ratingSum?: number;
  reviewCount?: number;
  status?: DriverProfileStatus;
  totalTripsDriven?: number;
}

