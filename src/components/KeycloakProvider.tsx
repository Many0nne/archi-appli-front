import { useMemo, type ReactNode } from 'react'
import type { AuthClientEvent, AuthClientError } from '@react-keycloak/core'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { getKeycloak } from '../config/keycloak'

interface KeycloakProviderProps {
  children: ReactNode
}

export default function KeycloakProvider({ children }: KeycloakProviderProps) {
  // Utiliser useMemo pour éviter de recréer l'instance à chaque render
  const keycloak = useMemo(() => getKeycloak(), [])

  // Callback appelé quand Keycloak change d'état
  const onKeycloakEvent = (event: AuthClientEvent, error?: AuthClientError) => {
    if (event === 'onInitError') {
      // Ignorer l'erreur de double initialisation en mode développement (React StrictMode)
      if (import.meta.env.DEV) {
        const errMessage =
          typeof error === 'string'
            ? error
            : error && typeof (error as any).message === 'string'
            ? (error as any).message
            : String(error ?? '')
        if (errMessage.includes('only be initialized once')) {
          console.warn('Keycloak: Tentative de réinitialisation ignorée (React StrictMode)')
          return
        }
      }
      console.error('Keycloak event:', event, error)
    } else if (event === 'onAuthError') {
      console.error('Keycloak event:', event, error)
    } else if (event === 'onTokenExpired') {
      console.log('Token expiré, rafraîchissement...')
      keycloak.updateToken(30)
    } else {
      console.log('Keycloak event:', event)
    }
  }

  // Callback appelé après l'initialisation de Keycloak
  const onKeycloakTokens = () => {
    if (import.meta.env.DEV) {
      console.log('Keycloak tokens received')
    }
  }

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false, // Désactiver l'iframe pour éviter les problèmes CORS
        pkceMethod: 'S256',
      }}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
      LoadingComponent={<div>Chargement de l'authentification...</div>}
    >
      {children}
    </ReactKeycloakProvider>
  )
}
