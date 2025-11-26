'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { Spinner } from '@/components/ui/spinner'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      // Attendre que le localStorage soit disponible (côté client)
      if (typeof window === 'undefined') {
        return
      }

      const authenticated = isAuthenticated()
      setIsAuth(authenticated)

      // Routes publiques
      const publicRoutes = ['/login']
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

      // Routes protégées
      const isProtectedRoute = pathname.startsWith('/admin')

      if (isProtectedRoute && !authenticated) {
        // Rediriger vers le login si non authentifié sur une route protégée
        if (!isRedirecting) {
          setIsRedirecting(true)
          router.replace('/login')
        }
        return
      }

      if (isPublicRoute && authenticated) {
        // Rediriger vers le dashboard si déjà authentifié sur la page de login
        if (!isRedirecting) {
          setIsRedirecting(true)
          router.replace('/admin/dashboard')
        }
        return
      }

      setIsChecking(false)
    }

    // Petit délai pour s'assurer que le localStorage est disponible
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname, router, isRedirecting])

  // Afficher un loader pendant la vérification ou la redirection
  if (isChecking || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">
            {isRedirecting ? 'Redirection...' : 'Vérification de l\'authentification...'}
          </p>
        </div>
      </div>
    )
  }

  // Ne pas afficher le contenu si non authentifié sur une route protégée
  const isProtectedRoute = pathname.startsWith('/admin')
  if (isProtectedRoute && !isAuth) {
    return null
  }

  return <>{children}</>
}

