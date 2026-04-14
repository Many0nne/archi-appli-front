import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RequireRole from '../../components/RequireRole'

vi.mock('@react-keycloak/web', () => ({
  useKeycloak: vi.fn(),
  ReactKeycloakProvider: ({ children }: any) => children,
}))

import { useKeycloak } from '@react-keycloak/web'

function makeKeycloak(options: { authenticated: boolean; roles?: string[] }) {
  const roles = options.roles ?? []
  return {
    keycloak: {
      authenticated: options.authenticated,
      token: options.authenticated ? 'mock-token' : undefined,
      tokenParsed: options.authenticated
        ? { sub: 'user-123', realm_access: { roles } }
        : null,
      hasRealmRole: (role: string) => roles.includes(role),
    } as any,
    initialized: true,
  }
}

function renderWithRouter(authenticated: boolean, roles: string[] = []) {
  vi.mocked(useKeycloak).mockReturnValue(makeKeycloak({ authenticated, roles }) as any)

  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/login" element={<div>Page login</div>} />
        <Route
          path="/admin"
          element={
            <RequireRole role="ADMIN">
              <div>Page admin</div>
            </RequireRole>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('RequireRole — Groupe 6 : contrôle d\'accès', () => {
  beforeEach(() => {
    vi.mocked(useKeycloak).mockReset()
  })

  it('utilisateur non authentifié → redirige vers /login', () => {
    renderWithRouter(false)
    expect(screen.getByText('Page login')).toBeInTheDocument()
  })

  it('utilisateur authentifié avec rôle ADMIN → rend les children', () => {
    renderWithRouter(true, ['ADMIN'])
    expect(screen.getByText('Page admin')).toBeInTheDocument()
  })

  it('utilisateur authentifié SANS rôle ADMIN → redirige vers /login', () => {
    // NOTE: Ce test échoue intentionnellement — l'implémentation actuelle affiche
    // "Accès refusé" au lieu de rediriger. C'est une implémentation incomplète.
    renderWithRouter(true, [])
    expect(screen.getByText('Page login')).toBeInTheDocument()
  })

  it('utilisateur authentifié SANS rôle → affiche message accès refusé (comportement actuel)', () => {
    renderWithRouter(true, [])
    // Ce test passe avec l'implémentation actuelle
    const hasLoginPage = screen.queryByText('Page login')
    const hasAccessDenied = screen.queryByText(/accès refusé/i)
    expect(hasLoginPage !== null || hasAccessDenied !== null).toBe(true)
  })
})

describe('RequireRole — Groupe 6 : ProtectedRoute', () => {
  it('Keycloak non initialisé → affiche chargement', () => {
    vi.mocked(useKeycloak).mockReturnValue({
      keycloak: { authenticated: false } as any,
      initialized: false,
    })

    render(
      <MemoryRouter>
        <RequireRole role="ADMIN">
          <div>Contenu</div>
        </RequireRole>
      </MemoryRouter>
    )
    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })
})
