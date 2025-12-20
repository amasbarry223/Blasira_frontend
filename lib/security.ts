/**
 * 🔒 Module de Sécurité - Blasira Frontend
 * 
 * Ce module centralise toutes les fonctions de sécurité
 * pour prévenir les vulnérabilités courantes.
 */

/**
 * Configuration de sécurité
 */
export const SECURITY_CONFIG = {
  // Durée de session (en millisecondes)
  SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 jours
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Token
  TOKEN_KEY: 'blasira_auth_token',
  TOKEN_REFRESH_KEY: 'blasira_refresh_token',
} as const;

/**
 * Gestion sécurisée des cookies
 */
export class SecureCookieManager {
  /**
   * Définit un cookie de manière sécurisée
   */
  static setCookie(
    name: string,
    value: string,
    options: {
      maxAge?: number;
      expires?: Date;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
      httpOnly?: boolean; // Note: httpOnly ne peut pas être défini via JavaScript
      path?: string;
    } = {}
  ): void {
    if (typeof window === 'undefined') {
      return;
    }

    const {
      maxAge,
      expires,
      secure = true, // Par défaut, toujours sécurisé
      sameSite = 'Strict',
      path = '/',
    } = options;

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (maxAge) {
      cookieString += `; Max-Age=${maxAge}`;
    }

    if (expires) {
      cookieString += `; Expires=${expires.toUTCString()}`;
    }

    cookieString += `; Path=${path}`;
    cookieString += `; SameSite=${sameSite}`;

    // Secure flag - seulement en HTTPS
    if (secure && window.location.protocol === 'https:') {
      cookieString += '; Secure';
    }

    document.cookie = cookieString;
  }

  /**
   * Récupère un cookie de manière sécurisée
   */
  static getCookie(name: string): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
      }
    }

    return null;
  }

  /**
   * Supprime un cookie de manière sécurisée
   */
  static deleteCookie(name: string, path: string = '/'): void {
    if (typeof window === 'undefined') {
      return;
    }

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Strict; Secure`;
  }
}

/**
 * Rate Limiter pour prévenir les attaques par force brute
 */
export class RateLimiter {
  private static attempts: Map<string, { count: number; lockoutUntil: number }> = new Map();

  /**
   * Vérifie si une action est autorisée
   */
  static checkLimit(
    key: string,
    maxAttempts: number = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS,
    lockoutDuration: number = SECURITY_CONFIG.LOCKOUT_DURATION
  ): { allowed: boolean; remainingAttempts: number; lockoutUntil?: number } {
    const now = Date.now();
    const record = this.attempts.get(key);

    // Si pas de record, autoriser
    if (!record) {
      this.attempts.set(key, { count: 0, lockoutUntil: 0 });
      return { allowed: true, remainingAttempts: maxAttempts };
    }

    // Vérifier si en lockout
    if (record.lockoutUntil > now) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutUntil: record.lockoutUntil,
      };
    }

    // Réinitialiser si le lockout est expiré
    if (record.lockoutUntil > 0 && record.lockoutUntil <= now) {
      this.attempts.set(key, { count: 0, lockoutUntil: 0 });
      return { allowed: true, remainingAttempts: maxAttempts };
    }

    // Vérifier le nombre de tentatives
    if (record.count >= maxAttempts) {
      const lockoutUntil = now + lockoutDuration;
      this.attempts.set(key, { count: record.count, lockoutUntil });
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutUntil,
      };
    }

    return {
      allowed: true,
      remainingAttempts: maxAttempts - record.count - 1,
    };
  }

  /**
   * Enregistre une tentative
   */
  static recordAttempt(key: string): void {
    const record = this.attempts.get(key) || { count: 0, lockoutUntil: 0 };
    record.count++;
    this.attempts.set(key, record);
  }

  /**
   * Réinitialise les tentatives (après succès)
   */
  static resetAttempts(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Nettoie les anciens records (appelé périodiquement)
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      // Supprimer les records expirés (après 24h)
      if (record.lockoutUntil > 0 && record.lockoutUntil < now - 24 * 60 * 60 * 1000) {
        this.attempts.delete(key);
      }
    }
  }
}

/**
 * Gestionnaire de tokens sécurisé
 */
export class SecureTokenManager {
  /**
   * Sauvegarde un token de manière sécurisée
   * Note: En production, les tokens doivent être gérés côté serveur avec HttpOnly
   */
  static saveToken(token: string, refreshToken?: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Pour l'instant, on utilise encore localStorage mais avec expiration
    // TODO: Migrer vers des cookies HttpOnly gérés par le serveur
    const expires = new Date();
    expires.setTime(expires.getTime() + SECURITY_CONFIG.SESSION_DURATION);

    // Stocker avec expiration
    const tokenData = {
      token,
      expires: expires.getTime(),
    };

    localStorage.setItem(SECURITY_CONFIG.TOKEN_KEY, JSON.stringify(tokenData));

    // Cookie pour le middleware (sera remplacé par HttpOnly côté serveur)
    SecureCookieManager.setCookie(SECURITY_CONFIG.TOKEN_KEY, token, {
      expires,
      secure: true,
      sameSite: 'Strict',
    });

    if (refreshToken) {
      SecureCookieManager.setCookie(SECURITY_CONFIG.TOKEN_REFRESH_KEY, refreshToken, {
        expires,
        secure: true,
        sameSite: 'Strict',
      });
    }
  }

  /**
   * Récupère le token de manière sécurisée
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    // Vérifier l'expiration
    const tokenDataStr = localStorage.getItem(SECURITY_CONFIG.TOKEN_KEY);
    if (!tokenDataStr) {
      return null;
    }

    try {
      const tokenData = JSON.parse(tokenDataStr);
      const now = Date.now();

      // Vérifier si expiré
      if (tokenData.expires && tokenData.expires < now) {
        this.removeToken();
        return null;
      }

      return tokenData.token;
    } catch {
      // Si erreur de parsing, supprimer et retourner null
      this.removeToken();
      return null;
    }
  }

  /**
   * Vérifie si le token est valide et non expiré
   */
  static isTokenValid(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Supprime le token de manière sécurisée
   */
  static removeToken(): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(SECURITY_CONFIG.TOKEN_KEY);
    SecureCookieManager.deleteCookie(SECURITY_CONFIG.TOKEN_KEY);
    SecureCookieManager.deleteCookie(SECURITY_CONFIG.TOKEN_REFRESH_KEY);
  }
}

/**
 * Validation et sanitization des entrées
 */
export class InputValidator {
  /**
   * Valide un email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide un numéro de téléphone (format international)
   */
  static isValidPhone(phone: string): boolean {
    // Format: +XX XXXXXXXXXX ou 0X XX XX XX XX
    const phoneRegex = /^(\+[1-9]\d{1,14}|0[1-9]\d{8,9})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Valide la force d'un mot de passe
   */
  static isStrongPassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Protection CSRF
 */
export class CSRFProtection {
  private static tokenKey = 'csrf_token';

  /**
   * Génère un token CSRF
   */
  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Récupère ou génère un token CSRF
   */
  static getToken(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    let token = sessionStorage.getItem(this.tokenKey);

    if (!token) {
      token = this.generateToken();
      sessionStorage.setItem(this.tokenKey, token);
    }

    return token;
  }

  /**
   * Vérifie un token CSRF
   */
  static verifyToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token && token.length > 0;
  }

  /**
   * Réinitialise le token CSRF
   */
  static resetToken(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.tokenKey);
    }
  }
}

/**
 * Headers de sécurité HTTP
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // À restreindre davantage
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.blasira.com", // Remplacer par votre API
    "frame-ancestors 'none'",
  ].join('; '),
} as const;
