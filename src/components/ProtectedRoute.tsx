import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthComposable from '../composables/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Redirige vers /login si l'utilisateur n'est pas connecté
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, initialized } = useAuthComposable()
  const location = useLocation()

  // Attendre que Keycloak soit initialisé
  if (!initialized) {
    return <div style={{ padding: 24 }}>Chargement...</div>
  }

  // Si non authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si authentifié, afficher le contenu
  return <>{children}</>
}
