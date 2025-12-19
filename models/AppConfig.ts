export interface AppConfig {
  general: {
    platformName: string;
    platformEmail: string;
    platformPhone: string;
    supportEmail: string;
    timezone: string;
    language: string;
  };
  trips: {
    maxPassengersPerTrip: number;
    minTripPrice: number;
    maxTripPrice: number;
    autoApproveTrips: boolean;
  };
  features: {
    enableReviews: boolean;
    enableChat: boolean;
  };
  security: {
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    requirePhotoVerification: boolean;
    allowStudentOnly: boolean;
    dataRetentionDays: number;
  };
  notifications: {
    admin: {
      notifyNewUsers: boolean;
      notifyNewTrips: boolean;
      notifyIncidents: boolean;
      notifyReports: boolean;
    };
    channels: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      pushNotifications: boolean;
    };
  };
  payments: {
    commissionRate: number;
    currency: string;
  };
  system: {
    maintenanceMode: boolean;
    backupFrequency: string;
  };
}