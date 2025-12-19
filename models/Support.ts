export interface TicketUser {
  id: number;
  name: string;
  email: string | null;
}

export interface SupportMessage {
  id: number;
  sender: {
    id: number;
    name: string;
    role: 'user' | 'admin';
  };
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: number;
  subject: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'PENDING' | 'RESOLVED';
  createdAt: string;
  lastUpdatedAt: string;
  user: TicketUser;
  messages: SupportMessage[] | null;
}

export interface PaginatedSupportTickets {
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
  data: SupportTicket[];
}
