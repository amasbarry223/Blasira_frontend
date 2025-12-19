import { PaginatedSupportTickets, SupportTicket } from '../models';
import { getAuthHeaders } from '../lib/auth';

interface GetTicketsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export class SupportService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async getTickets(params: GetTicketsParams = {}): Promise<PaginatedSupportTickets> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.status && params.status !== 'all') query.append('status', params.status.toUpperCase());
    if (params.search) query.append('search', params.search);

    const response = await fetch(`${this.baseUrl}/admin/support/tickets?${query.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch support tickets');
    }
    return response.json();
  }
  
  async getTicketById(ticketId: number): Promise<SupportTicket> {
    const response = await fetch(`${this.baseUrl}/admin/support/tickets/${ticketId}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ticket with id ${ticketId}`);
    }
    return response.json();
  }

  async updateTicketStatus(ticketId: number, status: 'RESOLVED' | 'PENDING' | 'OPEN'): Promise<SupportTicket> {
    const response = await fetch(`${this.baseUrl}/admin/support/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update ticket status');
    }
    return response.json();
  }
  
  async replyToTicket(ticketId: number, content: string): Promise<SupportTicket> {
    const response = await fetch(`${this.baseUrl}/admin/support/tickets/${ticketId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to post reply');
    }
    return response.json();
  }
}
