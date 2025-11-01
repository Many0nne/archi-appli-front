import { useCallback } from 'react'
import { useAuth } from '../stores/useAuth'
import type { Credentials, AuthResponse, RegisterData } from '../types/auth'

export const API_BASE = import.meta.env.VITE_API_BASE

export function useAuthComposable() {
  const token = useAuth(state => state.token)
  const setToken = useAuth(state => state.setToken)
  const logout = useAuth(state => state.logout)

  const login = useCallback(async (credentials: Credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Login failed')
    }
    const data: AuthResponse = await res.json()
    if (data?.token) setToken(data.token)
    return data
  }, [setToken])

  const register = useCallback(async (payload: RegisterData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Register failed')
    }
    const data: AuthResponse = await res.json()
    if (data?.token) setToken(data.token)
    return data
  }, [setToken])

  const refresh = useCallback(async () => {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) return null
    const data: AuthResponse = await res.json()
    setToken(data.token)
    return data
  }, [setToken])

  const fetchWithAuth = useCallback(
    async (input: RequestInfo, init: RequestInit = {}) => {
      const headers = new Headers(init.headers ?? undefined)
      if (token) headers.set('Authorization', `Bearer ${token}`)
      headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json')

      const res = await fetch(input, { ...init, headers })
      return res
    },
    [token],
  )

  return { token, login, register, refresh, logout, fetchWithAuth }
}

export default useAuthComposable
