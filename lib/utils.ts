import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fonctions de sécurité pour prévenir les vulnérabilités React2shell/RCE
 */

/**
 * Sanitize une chaîne pour éviter l'injection HTML/XSS
 * Supprime les balises HTML et les caractères dangereux
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/&/g, '&amp;')
}

/**
 * Sanitize une valeur pour l'utilisation dans du CSS
 * Supprime les caractères dangereux qui pourraient permettre l'injection CSS
 */
export function sanitizeCSS(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  // Supprime les caractères dangereux pour CSS
  return input.replace(/[<>'"&;{}]/g, '')
}

/**
 * Sanitize un ID pour l'utilisation dans des attributs HTML
 * Ne garde que les caractères alphanumériques, tirets et underscores
 */
export function sanitizeId(input: string): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  return input.replace(/[^a-zA-Z0-9_-]/g, '')
}

/**
 * Valide qu'une valeur est sûre pour l'injection dans dangerouslySetInnerHTML
 * Retourne true si la valeur est sûre, false sinon
 */
export function isSafeForInnerHTML(input: string): boolean {
  if (typeof input !== 'string') {
    return false
  }
  
  // Vérifie la présence de balises script, iframe, ou d'attributs dangereux
  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /data:text\/html/i,
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(input))
}
