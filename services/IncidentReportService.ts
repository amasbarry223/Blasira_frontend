import {
  IncidentReport,
  CreateIncidentReportDto,
  UpdateIncidentReportDto,
  AdminIncidentReport,
} from '../models';
import { getAuthHeaders } from '../lib/auth'; // Import shared auth headers

export interface UpdateIncidentStatusRequest {
  status: "RESOLVED" | "OPEN" | "UNDER_REVIEW" | "CLOSED";
}

export class IncidentReportService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async getAdminIncidentReports(): Promise<AdminIncidentReport[]> {
    const response = await fetch(`${this.baseUrl}/admin/incident-reports`, {
      headers: getAuthHeaders(), // Use shared
    });
    if (!response.ok) {
      throw new Error('Failed to fetch admin incident reports');
    }
    return response.json();
  }

  async getAll(): Promise<IncidentReport[]> {
    const response = await fetch(`${this.baseUrl}/incident-reports`, {
      headers: getAuthHeaders(), // Use shared
    });
    if (!response.ok) {
      throw new Error('Failed to fetch incident reports');
    }
    return response.json();
  }

  async getById(id: number): Promise<IncidentReport> {
    const response = await fetch(`${this.baseUrl}/incident-reports/${id}`, {
      headers: getAuthHeaders(), // Use shared
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch incident report with id ${id}`);
    }
    return response.json();
  }

  async getByReporterId(reporterId: number): Promise<IncidentReport[]> {
    const response = await fetch(`${this.baseUrl}/incident-reports/reporter/${reporterId}`, {
      headers: getAuthHeaders(), // Use shared
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch incident reports for reporter ${reporterId}`);
    }
    return response.json();
  }

  async getByBookingId(bookingId: number): Promise<IncidentReport[]> {
    const response = await fetch(`${this.baseUrl}/incident-reports/booking/${bookingId}`, {
      headers: getAuthHeaders(), // Use shared
    });
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
        ...getAuthHeaders(), // Use shared
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
        ...getAuthHeaders(), // Use shared
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update incident report with id ${id}`);
    }
    return response.json();
  }

  async updateIncidentStatus(reportId: number, status: "RESOLVED" | "OPEN" | "UNDER_REVIEW" | "CLOSED"): Promise<IncidentReport> {
    const response = await fetch(`${this.baseUrl}/admin/incident-reports/${reportId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update incident status' }));
      throw new Error(errorData.message || `Failed to update incident status: ${response.status}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/incident-reports/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(), // Use shared
    });
    if (!response.ok) {
      throw new Error(`Failed to delete incident report with id ${id}`);
    }
  }
}

