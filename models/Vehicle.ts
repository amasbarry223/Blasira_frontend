import { VehicleType, VehicleVerificationStatus } from './enums';

export interface Vehicle {
  id: number;
  color: string | null;
  licensePlate: string;
  make: string;
  model: string;
  type: VehicleType;
  verificationStatus: VehicleVerificationStatus;
  year: number;
  ownerUserId: number;
  capacity: number;
}

export interface CreateVehicleDto {
  color?: string;
  licensePlate: string;
  make: string;
  model: string;
  type: VehicleType;
  verificationStatus: VehicleVerificationStatus;
  year: number;
  ownerUserId: number;
  capacity: number;
}

export interface UpdateVehicleDto {
  color?: string;
  licensePlate?: string;
  make?: string;
  model?: string;
  type?: VehicleType;
  verificationStatus?: VehicleVerificationStatus;
  year?: number;
  capacity?: number;
}

