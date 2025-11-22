import { AdminUser } from '../models';
import { getAuthHeaders } from '../lib/auth';

export class AdminService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
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
}

