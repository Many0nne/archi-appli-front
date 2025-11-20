import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthComposable from '../composables/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, initialized } = useAuthComposable()
  const location = useLocation()
  if (!initialized) {
    return <div style={{ padding: 24 }}>Chargement...</div>
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
