import { create } from 'zustand'

export interface AuthState {
  token: string | null
  user: any | null
  setToken: (t: string | null) => void
  setUser: (u: any | null) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (t: string | null) => set({ token: t }),
  setUser: (u: any | null) => set({ user: u }),
  logout: () => set({ token: null, user: null }),
}))

export default useAuth
