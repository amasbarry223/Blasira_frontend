import {
  IncidentReport,
  CreateIncidentReportDto,
  UpdateIncidentReportDto,
} from '../models';

export class IncidentReportService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<IncidentReport[]> {
    const response = await fetch(`${this.baseUrl}/incident-reports`);
    if (!response.ok) {
      throw new Error('Failed to fetch incident reports');
    }
    return response.json();
  }

  async getById(id: number): Promise<IncidentReport> {
    const response = await fetch(`${this.baseUrl}/incident-reports/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch incident report with id ${id}`);
    }
    return response.json();
  }

  async getByReporterId(reporterId: number): Promise<IncidentReport[]> {
    const response = await fetch(`${this.baseUrl}/incident-reports/reporter/${reporterId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch incident reports for reporter ${reporterId}`);
    }
    return response.json();
  }

  async getByBookingId(bookingId: number): Promise<IncidentReport[]> {
    const response = await fetch(`${this.baseUrl}/incident-reports/booking/${bookingId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch incident reports for booking ${bookingId}`);
    }
    return response.json();
  }

  async create(data: CreateIncidentReportDto): Promise<IncidentReport> {
    const response = await fetch(`${this.baseUrl}/incident-reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create incident report');
    }
    return response.json();
  }

  async update(id: number, data: UpdateIncidentReportDto): Promise<IncidentReport> {
    const response = await fetch(`${this.baseUrl}/incident-reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update incident report with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/incident-reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete incident report with id ${id}`);
    }
  }
}

