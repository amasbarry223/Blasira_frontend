import { TripStatus } from './enums';

export interface Trip {
  id: number;
  availableSeats: number;
  departureAddress: string;
  departureCoordinates: string | null;
  departureTime: Date;
  destinationAddress: string;
  destinationCoordinates: string | null;
  pricePerSeat: number;
  status: TripStatus;
  driverId: number;
  vehicleId: number;
}

export interface CreateTripDto {
  availableSeats: number;
  departureAddress: string;
  departureCoordinates?: string;
  departureTime: Date;
  destinationAddress: string;
  destinationCoordinates?: string;
  pricePerSeat: number;
  status: TripStatus;
  driverId: number;
  vehicleId: number;
}

export interface UpdateTripDto {
  availableSeats?: number;
  departureAddress?: string;
  departureCoordinates?: string;
  departureTime?: Date;
  destinationAddress?: string;
  destinationCoordinates?: string;
  pricePerSeat?: number;
  status?: TripStatus;
  vehicleId?: number;
}

