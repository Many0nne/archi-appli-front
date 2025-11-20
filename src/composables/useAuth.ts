import { useCallback, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useAuth } from '../stores/useAuth'

export const API_BASE = import.meta.env.VITE_API_BASE

export function useAuthComposable() {
  const { keycloak, initialized } = useKeycloak()
  const token = useAuth(state => state.token)
  const user = useAuth(state => state.user)
  const setToken = useAuth(state => state.setToken)
  const setUser = useAuth(state => state.setUser)
  const logoutStore = useAuth(state => state.logout)

  useEffect(() => {
    if (initialized && keycloak.authenticated && keycloak.token) {
      setToken(keycloak.token)
      if (keycloak.tokenParsed) {
        setUser({
          username: keycloak.tokenParsed.preferred_username,
          email: keycloak.tokenParsed.email,
          name: keycloak.tokenParsed.name,
          roles: keycloak.tokenParsed.realm_access?.roles || [],
        })
      }
    } else if (initialized && !keycloak.authenticated) {
      setToken(null)
      setUser(null)
    }
  }, [initialized, keycloak.authenticated, keycloak.token, keycloak.tokenParsed, setToken, setUser])

  const login = useCallback(() => {
    keycloak.login()
  }, [keycloak])

  const logout = useCallback(() => {
    logoutStore()
    keycloak.logout({ redirectUri: window.location.origin })
  }, [keycloak, logoutStore])

  const register = useCallback(() => {
    keycloak.register()
  }, [keycloak])

  const fetchWithAuth = useCallback(
    async (input: RequestInfo, init: RequestInit = {}) => {
      const headers = new Headers(init.headers ?? undefined)
      
      if (keycloak.authenticated && keycloak.isTokenExpired(5)) {
        try {
          await keycloak.updateToken(5)
        } catch (error) {
          console.error('Failed to refresh token', error)
          keycloak.logout()
          throw new Error('Session expirée')
        }
      }

      if (keycloak.token) {
        headers.set('Authorization', `Bearer ${keycloak.token}`)
      }
      headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json')

      const res = await fetch(input, { ...init, headers })
      return res
    },
    [keycloak],
  )

  return { 
    token, 
    user,
    login, 
    register, 
    logout, 
    fetchWithAuth,
    isAuthenticated: keycloak.authenticated || false,
    initialized,
  }
}

export default useAuthComposable
