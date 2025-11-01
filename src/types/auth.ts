export interface Credentials {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
}

export interface LoginData {
  username: string
  password: string
}

export interface AuthState {
  token: string | null
  setToken: (t: string | null) => void
  logout: () => void
}
