import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from '../../components/ProtectedRoute'

vi.mock('../../composables/useAuth', () => ({
  default: vi.fn(),
  useAuthComposable: vi.fn(),
}))

import useAuthComposable from '../../composables/useAuth'

function LoginPage() {
  const location = useLocation()
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname

  return (
    <>
      <div>Page login</div>
      {fromPath ? <div>from:{fromPath}</div> : null}
    </>
  )
}

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/reservations']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <div>Mes reservations</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.mocked(useAuthComposable).mockReset()
  })

  it('redirige vers /login si utilisateur non connecté', () => {
    vi.mocked(useAuthComposable).mockReturnValue({
      isAuthenticated: false,
      initialized: true,
    } as any)

    renderProtectedRoute()

    expect(screen.getByText('Page login')).toBeInTheDocument()
    expect(screen.getByText('from:/reservations')).toBeInTheDocument()
    expect(screen.queryByText('Mes reservations')).not.toBeInTheDocument()
  })

  it('rend les children si utilisateur connecté', () => {
    vi.mocked(useAuthComposable).mockReturnValue({
      isAuthenticated: true,
      initialized: true,
    } as any)

    renderProtectedRoute()

    expect(screen.getByText('Mes reservations')).toBeInTheDocument()
    expect(screen.queryByText('Page login')).not.toBeInTheDocument()
  })

  it('affiche un état de chargement si auth non initialisée', () => {
    vi.mocked(useAuthComposable).mockReturnValue({
      isAuthenticated: false,
      initialized: false,
    } as any)

    renderProtectedRoute()

    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })
})
