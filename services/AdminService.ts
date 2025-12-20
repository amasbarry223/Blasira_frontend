import { AdminUser, DashboardStats, VerificationRequest } from '../models';
import { getAuthHeaders } from '../lib/auth';

export interface UpdateDocumentStatusRequest {
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
}

export interface RejectVerificationRequest {
  reason: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string; // Password might be optional
  roles: string[];
}

export class AdminService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // ⚠️ SECURITY: Utiliser une variable d'environnement
    // Ne jamais hardcoder l'URL de l'API
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  async getAllUsers(): Promise<AdminUser[]> {
    const response = await fetch(`${this.baseUrl}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé. Veuillez vous reconnecter.');
      }
      if (response.status === 403) {
        throw new Error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      }
      throw new Error(`Échec de la récupération des utilisateurs: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.baseUrl}/admin/dashboard-stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé. Veuillez vous reconnecter.');
      }
      if (response.status === 403) {
        throw new Error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      }
      throw new Error(`Échec de la récupération des statistiques: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getDocumentVerifications(): Promise<VerificationRequest[]> {
    const response = await fetch(`${this.baseUrl}/admin/documents`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Non autorisé. Veuillez vous reconnecter.');
      }
      if (response.status === 403) {
        throw new Error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      }
      throw new Error(`Échec de la récupération des vérifications: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateUser(userId: number, userData: UpdateUserRequest): Promise<AdminUser> {
    const response = await fetch(`${this.baseUrl}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Échec de la mise à jour de l'utilisateur: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateDocumentStatus(documentId: number, requestBody: UpdateDocumentStatusRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/documents/${documentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Échec de la mise à jour du statut du document: ${response.status} ${response.statusText}`);
    }
  }

  async approveVerificationProcess(userId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/verifications/${userId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Échec de l'approbation du processus de vérification: ${response.status} ${response.statusText}`);
    }
  }

  async rejectVerificationProcess(userId: number, requestBody: RejectVerificationRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/verifications/${userId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Échec du rejet du processus de vérification: ${response.status} ${response.statusText}`);
    }
  }
}


