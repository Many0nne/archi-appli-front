import { create } from 'zustand'
import type { AuthState } from '../types/auth'

export const useAuth = create<AuthState>((set) => ({
  token: null,
  setToken: (t: string | null) => set({ token: t }),
  logout: () => set({ token: null }),
}))

export default useAuth
