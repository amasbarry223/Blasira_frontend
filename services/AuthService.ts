export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export class AuthService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || 
        errorData.error || 
        `Échec de la connexion: ${response.status} ${response.statusText}`
      );
      
      // Ajouter des informations supplémentaires pour une meilleure gestion
      (error as any).status = response.status;
      (error as any).errorData = errorData;
      
      throw error;
    }

    return response.json();
  }

  async logout(): Promise<void> {
    // Si vous avez un endpoint de logout côté serveur
    // const response = await fetch(`${this.baseUrl}/auth/logout`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.getToken()}`,
    //   },
    // });
    // if (!response.ok) {
    //   throw new Error('Failed to logout');
    // }
  }
}

