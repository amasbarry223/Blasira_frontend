/**
 * Gestion du token d'authentification - VERSION SÉCURISÉE
 * 
 * ⚠️ IMPORTANT: En production, les tokens doivent être gérés côté serveur
 * avec des cookies HttpOnly. Cette implémentation est une solution temporaire.
 */

import { SecureTokenManager, SecureCookieManager, CSRFProtection } from './security';

const TOKEN_KEY = 'blasira_auth_token';

/**
 * Sauvegarde le token de manière sécurisée
 * 
 * ⚠️ SECURITY NOTE: 
 * - En production, cette fonction doit appeler une API serveur
 * - Le serveur doit créer un cookie HttpOnly avec Secure et SameSite=Strict
 * - Le token ne doit JAMAIS être accessible via JavaScript
 */
export function saveToken(token: string, refreshToken?: string): void {
  if (typeof window !== 'undefined') {
    // Utiliser le gestionnaire sécurisé
    SecureTokenManager.saveToken(token, refreshToken);
    
    // TODO: Appeler une API serveur pour créer un cookie HttpOnly
    // await fetch('/api/auth/set-token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token }),
    // });
  }
}

/**
 * Récupère le token de manière sécurisée
 * 
 * ⚠️ SECURITY NOTE:
 * - Vérifie l'expiration du token
 * - En production, le token doit être dans un cookie HttpOnly
 */
export function getToken(): string | null {
  return SecureTokenManager.getToken();
}

/**
 * Supprime le token de manière sécurisée
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    SecureTokenManager.removeToken();
    CSRFProtection.resetToken();
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 * 
 * ⚠️ SECURITY NOTE:
 * - Cette vérification côté client n'est pas suffisante
 * - Le serveur doit TOUJOURS valider le token
 */
export function isAuthenticated(): boolean {
  return SecureTokenManager.isTokenValid();
}

/**
 * Récupère les en-têtes d'authentification pour les requêtes API
 * 
 * ⚠️ SECURITY NOTE:
 * - Inclut un token CSRF pour la protection contre les attaques CSRF
 * - Le serveur doit valider à la fois le token JWT et le token CSRF
 */
export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const csrfToken = CSRFProtection.getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ajouter le token CSRF
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return headers;
}

