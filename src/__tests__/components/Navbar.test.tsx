import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../../components/navbar'
import { mockUser, mockAdmin } from '../../test/msw/fixtures'

vi.mock('@react-keycloak/web', () => ({
  useKeycloak: vi.fn(),
  ReactKeycloakProvider: ({ children }: any) => children,
}))

vi.mock('../../composables/useAuth', () => ({
  default: vi.fn(),
  useAuthComposable: vi.fn(),
}))

import { default as useAuthComposable } from '../../composables/useAuth'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar — Groupe 7 : utilisateur non connecté', () => {
  beforeEach(() => {
    vi.mocked(useAuthComposable).mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      fetchWithAuth: vi.fn(),
      initialized: true,
    } as any)
  })

  it('affiche le bouton "Login" quand non connecté', () => {
    renderNavbar()
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })

  it("n'affiche aucun nom d'utilisateur quand non connecté", () => {
    renderNavbar()
    expect(screen.queryByText(/bonjour/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Jean Dupont')).not.toBeInTheDocument()
  })

  it('le lien "Admin" est absent pour un utilisateur non connecté', () => {
    renderNavbar()
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })
})

describe('Navbar — Groupe 7 : utilisateur connecté standard', () => {
  beforeEach(() => {
    vi.mocked(useAuthComposable).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      fetchWithAuth: vi.fn(),
      initialized: true,
    } as any)
  })

  it("affiche le nom d'utilisateur quand connecté", () => {
    renderNavbar()
    expect(screen.getByText(/jean\.dupont|Jean Dupont/i)).toBeInTheDocument()
  })

  it('affiche le bouton "Logout" quand connecté', () => {
    renderNavbar()
    expect(screen.getByText(/logout/i)).toBeInTheDocument()
  })

  it('le lien "Admin" est absent pour un utilisateur standard', () => {
    renderNavbar()
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })
})

describe('Navbar — Groupe 7 : utilisateur ADMIN', () => {
  beforeEach(() => {
    vi.mocked(useAuthComposable).mockReturnValue({
      isAuthenticated: true,
      user: mockAdmin,
      token: 'mock-token-admin',
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      fetchWithAuth: vi.fn(),
      initialized: true,
    } as any)
  })

  it('le lien "Admin" est visible pour un utilisateur ADMIN', () => {
    renderNavbar()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
