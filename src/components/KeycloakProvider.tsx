import { useMemo, type ReactNode } from 'react'
import type { AuthClientEvent, AuthClientError } from '@react-keycloak/core'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { getKeycloak } from '../config/keycloak'
import { useAuth } from '../stores/useAuth'

interface KeycloakProviderProps {
  children: ReactNode
}

function createMockKeycloak(user: any, token: string | null) {
  const roles: string[] = user?.roles ?? []
  return {
    authenticated: !!token,
    token: token ?? undefined,
    tokenParsed: user
      ? {
          sub: user.id,
          preferred_username: user.username,
          email: user.email,
          name: user.name,
          realm_access: { roles },
        }
      : undefined,
    realm: 'mock',
    clientId: 'mock',
    authServerUrl: '',
    hasRealmRole: (role: string) => roles.includes(role),
    hasResourceRole: () => false,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
    isTokenExpired: () => false,
    updateToken: () => Promise.resolve(false),
    clearToken: () => {},
    loadUserInfo: () => Promise.resolve({}),
    loadUserProfile: () => Promise.resolve({}),
    createLoginUrl: () => '#',
    createLogoutUrl: () => '/',
    createRegisterUrl: () => '#',
    init: (_options: any) => Promise.resolve(!!token),
    onReady: undefined,
    onAuthSuccess: undefined,
    onAuthError: undefined,
    onAuthRefreshSuccess: undefined,
    onAuthRefreshError: undefined,
    onAuthLogout: undefined,
    onTokenExpired: undefined,
  }
}

export default function KeycloakProvider({ children }: KeycloakProviderProps) {
  if (import.meta.env.VITE_E2E_MOCK_AUTH === 'true') {
    let user: any = null
    let token: string | null = null
    try {
      const stored = localStorage.getItem('test-auth')
      if (stored) {
        const parsed = JSON.parse(stored)
        user = parsed.user ?? null
        token = parsed.token ?? null
      }
    } catch {}

    useAuth.getState().setToken(token)
    useAuth.getState().setUser(user)

    const mockKc = createMockKeycloak(user, token)
    return (
      <ReactKeycloakProvider authClient={mockKc as any} initOptions={{}}>
        {children}
      </ReactKeycloakProvider>
    )
  }

  const keycloak = useMemo(() => getKeycloak(), [])

  const onKeycloakEvent = (event: AuthClientEvent, error?: AuthClientError) => {
    if (event === 'onInitError') {
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
        checkLoginIframe: false,
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
