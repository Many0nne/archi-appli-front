import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'

interface RequireRoleProps {
  role: string
  children: ReactNode
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const { keycloak, initialized } = useKeycloak()
  const location = useLocation()

  if (!initialized) {
    return <div style={{ padding: 24 }}>Chargement...</div>
  }

  if (!keycloak?.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  let hasRole = false
  try {
    
    // @ts-ignore
    if (typeof keycloak.hasRealmRole === 'function') {
      // @ts-ignore
      hasRole = keycloak.hasRealmRole(role)
    } else {
      const parsed = (keycloak.tokenParsed as any) || {}
      const roles: string[] = parsed?.realm_access?.roles || []
      hasRole = roles.includes(role)
    }
  } catch (err) {
    hasRole = false
  }

  if (!hasRole) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Accès refusé</h2>
        <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
      </div>
    )
  }

  return <>{children}</>
}
