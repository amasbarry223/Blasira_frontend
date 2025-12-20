/**
 * 🔒 Client API Sécurisé
 * 
 * Wrapper sécurisé pour toutes les requêtes fetch avec :
 * - Timeout automatique
 * - Gestion d'erreurs sécurisée
 * - Headers de sécurité
 * - Protection CSRF
 */

import { getAuthHeaders } from './auth';
import { CSRFProtection } from './security';

const DEFAULT_TIMEOUT = 10000; // 10 secondes

interface FetchOptions extends RequestInit {
  timeout?: number;
  requireAuth?: boolean;
  requireCSRF?: boolean;
}

/**
 * Client API sécurisé avec timeout et gestion d'erreurs
 */
export class SecureApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Effectue une requête fetch sécurisée avec timeout
   */
  async fetch(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const {
      timeout = DEFAULT_TIMEOUT,
      requireAuth = true,
      requireCSRF = true,
      headers = {},
      ...fetchOptions
    } = options;

    // Construire l'URL complète
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Préparer les headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Ajouter l'authentification si nécessaire
    if (requireAuth) {
      const authHeaders = getAuthHeaders();
      Object.assign(requestHeaders, authHeaders);
    }

    // Ajouter le token CSRF si nécessaire
    if (requireCSRF && (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT' || fetchOptions.method === 'PATCH' || fetchOptions.method === 'DELETE')) {
      const csrfToken = CSRFProtection.getToken();
      if (csrfToken) {
        requestHeaders['X-CSRF-Token'] = csrfToken;
      }
    }

    // Créer un AbortController pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Gérer les erreurs HTTP
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('La requête a expiré. Veuillez réessayer.');
        }
        throw error;
      }

      throw new Error('Une erreur réseau est survenue. Veuillez vérifier votre connexion.');
    }
  }

  /**
   * Gère les réponses d'erreur de manière sécurisée
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = 'Une erreur est survenue.';
    let errorData: any = {};

    try {
      errorData = await response.json();
    } catch {
      // Si le parsing JSON échoue, utiliser le message par défaut
    }

    // Messages d'erreur génériques pour éviter l'information disclosure
    switch (response.status) {
      case 401:
        errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
        // Rediriger vers login si nécessaire
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        break;
      case 403:
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        break;
      case 404:
        errorMessage = 'Ressource non trouvée.';
        break;
      case 429:
        errorMessage = 'Trop de requêtes. Veuillez réessayer plus tard.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        break;
      default:
        // En développement, on peut exposer plus de détails
        if (process.env.NODE_ENV === 'development') {
          errorMessage = errorData.message || errorData.error || `Erreur ${response.status}: ${response.statusText}`;
        } else {
          errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    
    // Ne pas exposer errorData en production
    if (process.env.NODE_ENV === 'development') {
      (error as any).errorData = errorData;
    }

    throw error;
  }

  /**
   * Méthodes helper pour les requêtes courantes
   */
  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'GET',
    });
    return response.json();
  }

  async post<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  }

  async put<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  }

  async patch<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const response = await this.fetch(endpoint, {
      ...options,
      method: 'DELETE',
    });
    return response.json();
  }
}

// Instance par défaut
export const apiClient = new SecureApiClient();
