import { IncidentReportStatus } from './enums';

export interface IncidentReport {
  id: number;
  createdAt: Date | null;
  description: string | null;
  reason: string;
  status: IncidentReportStatus;
  bookingId: number | null;
  reporterId: number;
}

export interface CreateIncidentReportDto {
  description?: string;
  reason: string;
  status: IncidentReportStatus;
  bookingId?: number;
  reporterId: number;
}

export interface UpdateIncidentReportDto {
  description?: string;
  reason?: string;
  status?: IncidentReportStatus;
}

