import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Routes protégées (admin)
  const isProtectedRoute = pathname.startsWith('/admin');

  // Vérifier le token dans les cookies
  const token = request.cookies.get('blasira_auth_token')?.value;

  // Si c'est une route protégée et pas de token, laisser le client gérer la redirection
  // Le composant AuthGuard s'en chargera côté client (car le token est dans localStorage)
  // Note: Pour une sécurité complète côté serveur, vous devriez synchroniser le token
  // entre localStorage et cookies lors du login

  // Si l'utilisateur est sur /login et a déjà un token dans les cookies, rediriger
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
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

