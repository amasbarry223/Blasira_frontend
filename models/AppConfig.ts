export interface AppConfig {
  id: number;
  baseFare: number;
  pricePerKm: number;
  defaultCurrency: string;
  driverValidationRequired: boolean;
}

export interface CreateAppConfigDto {
  baseFare: number;
  pricePerKm: number;
  defaultCurrency: string;
  driverValidationRequired: boolean;
}

export interface UpdateAppConfigDto {
  baseFare?: number;
  pricePerKm?: number;
  defaultCurrency?: string;
  driverValidationRequired?: boolean;
}

