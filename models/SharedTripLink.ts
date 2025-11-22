export interface SharedTripLink {
  id: number;
  expiresAt: Date;
  token: string;
  tripId: number;
}

export interface CreateSharedTripLinkDto {
  expiresAt: Date;
  token: string;
  tripId: number;
}

export interface UpdateSharedTripLinkDto {
  expiresAt?: Date;
  token?: string;
}

