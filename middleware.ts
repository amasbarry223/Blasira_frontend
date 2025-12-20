import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login', '/landing'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Routes protégées (admin)
  const isProtectedRoute = pathname.startsWith('/admin');

  // Vérifier le token dans les cookies
  const token = request.cookies.get('blasira_auth_token')?.value;

  // 🔒 SECURITY: Si l'utilisateur est sur /login et a déjà un token valide, rediriger
  if (pathname === '/login' && token) {
    // ⚠️ NOTE: En production, valider le token avec le backend
    // Pour l'instant, on vérifie juste sa présence
    // TODO: Implémenter la validation du token avec le backend
    // try {
    //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    //   const response = await fetch(`${apiUrl}/auth/validate`, {
    //     headers: { 'Authorization': `Bearer ${token}` },
    //   });
    //   if (response.ok) {
    //     return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    //   }
    // } catch {
    //   // Si la validation échoue, laisser passer pour que AuthGuard gère
    // }
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // 🔒 SECURITY: Pour les routes protégées, vérifier le token
  // Note: La validation complète se fait côté client avec AuthGuard
  // En production, implémenter la validation serveur ici
  if (isProtectedRoute && !token) {
    // Rediriger vers login si pas de token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🔒 SECURITY: Ajouter les headers de sécurité à toutes les réponses
  const response = NextResponse.next();
  
  // Headers de sécurité
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

