export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  acceptedTrustCharter: boolean;
}

export interface SignupResponse {
	// Selon ce que le backend retourne, par ex: un message de succès ou l'utilisateur créé
	message: string;
}


export class AuthService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // ⚠️ SECURITY: Utiliser une variable d'environnement
    // Ne jamais hardcoder l'URL de l'API
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // ⚠️ SECURITY: Vérifier le rate limiting avant la requête
    // Cette vérification doit aussi être faite côté serveur
    
    // Créer un AbortController pour timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes

    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // ⚠️ SECURITY: Ne pas exposer les détails d'erreur
        // Messages génériques pour éviter l'information disclosure
        let errorMessage = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        
        // Messages spécifiques uniquement pour les erreurs utilisateur
        if (response.status === 401) {
          errorMessage = 'Identifiants incorrects.';
        } else if (response.status === 429) {
          errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
        } else if (response.status >= 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
        
        const error = new Error(errorMessage);
        
        // Ne pas exposer les détails techniques
        (error as any).status = response.status;
        // Ne pas exposer errorData en production
        if (process.env.NODE_ENV === 'development') {
          (error as any).errorData = errorData;
        }
        
        throw error;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La requête a expiré. Veuillez réessayer.');
      }
      
      throw error;
    }
  }

  async signup(userData: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || 
        errorData.error || 
        `Échec de l'inscription: ${response.status} ${response.statusText}`
      );
      
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

