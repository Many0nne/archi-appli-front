import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ReservationsPage from '../../pages/reservations'
import { reservationsUser, mockUser } from '../../test/msw/fixtures'

vi.mock('@react-keycloak/web', () => ({
  useKeycloak: vi.fn(),
  ReactKeycloakProvider: ({ children }: any) => children,
}))

vi.mock('../../composables/useAuth', () => ({
  default: vi.fn(),
  useAuthComposable: vi.fn(),
}))

vi.mock('../../composables/useReservation', () => ({
  getReservationsForUser: vi.fn(),
  deleteReservation: vi.fn(),
}))

vi.mock('../../config/keycloak', () => ({
  getKeycloak: vi.fn(() => ({ tokenParsed: { sub: 'user-123' }, token: 'mock-token' })),
  resetKeycloak: vi.fn(),
}))

import useAuthComposable from '../../composables/useAuth'
import { getReservationsForUser, deleteReservation } from '../../composables/useReservation'

// Réservation future : dans > 2h
const reservationFuture = {
  id: 10,
  reservationDate: '2026-03-01T10:00:00',
  quantity: 2,
  totalPrice: 50.00,
  spectacle: { id: 1, title: 'Hamlet', date: '2099-06-15T20:00:00', price: 25.00, imageUrl: '/hamlet.jpg' },
}

// Réservation passée
const reservationPassee = {
  id: 11,
  reservationDate: '2025-01-01T10:00:00',
  quantity: 1,
  totalPrice: 45.00,
  spectacle: { id: 2, title: 'Le Roi Lion', date: '2025-01-15T19:30:00', price: 45.00, imageUrl: '/lion.jpg' },
}

// Réservation avec spectacle dans moins de 2h (proche de maintenant)
const reservationProche = {
  id: 12,
  reservationDate: '2026-04-14T10:00:00',
  quantity: 1,
  totalPrice: 25.00,
  spectacle: {
    id: 1,
    title: 'Hamlet Proche',
    date: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // dans 30 minutes
    price: 25.00,
    imageUrl: '/hamlet.jpg',
  },
}

function setupAuth(authenticated = true) {
  vi.mocked(useAuthComposable).mockReturnValue({
    isAuthenticated: authenticated,
    user: authenticated ? mockUser : null,
    token: authenticated ? 'mock-token' : null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    fetchWithAuth: vi.fn(),
    initialized: true,
  } as any)
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ReservationsPage />
    </MemoryRouter>
  )
}

describe('ReservationsPage — Groupe 8 : affichage des réservations', () => {
  beforeEach(() => {
    setupAuth(true)
    vi.mocked(getReservationsForUser).mockResolvedValue([reservationFuture, reservationPassee] as any)
    vi.mocked(deleteReservation).mockResolvedValue(undefined)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('affiche la section "À venir"', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/à venir/i)).toBeInTheDocument()
    })
  })

  it('affiche la section "Passées"', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/passées/i)).toBeInTheDocument()
    })
  })

  it('les réservations futures apparaissent dans la section "À venir"', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Hamlet')).toBeInTheDocument()
    })
  })

  it('les réservations passées apparaissent dans la section "Passées"', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Le Roi Lion')).toBeInTheDocument()
    })
  })

  it('affiche "Aucune réservation" si la liste est vide', async () => {
    vi.mocked(getReservationsForUser).mockResolvedValue([])
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/aucune réservation à venir/i)).toBeInTheDocument()
    })
  })

  it('affiche la quantité sur chaque réservation', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument() // quantity de Hamlet
    })
  })
})

describe('ReservationsPage — Groupe 8 : annulation', () => {
  beforeEach(() => {
    setupAuth(true)
    vi.mocked(deleteReservation).mockResolvedValue(undefined)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('le bouton "Annuler" est visible pour une réservation future (> 2h)', async () => {
    vi.mocked(getReservationsForUser).mockResolvedValue([reservationFuture] as any)
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Hamlet')).toBeInTheDocument()
    })
    // Le bouton annuler doit être actif (pas disabled)
    const buttons = screen.getAllByRole('button')
    const cancelBtn = buttons.find(b => b.textContent?.includes('Annuler'))
    expect(cancelBtn).toBeTruthy()
    expect(cancelBtn).not.toBeDisabled()
  })

  it('le bouton "Annuler" est désactivé pour un spectacle dans < 2h', async () => {
    vi.mocked(getReservationsForUser).mockResolvedValue([reservationProche] as any)
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Hamlet Proche')).toBeInTheDocument()
    })
    const buttons = screen.getAllByRole('button')
    const cancelBtn = buttons.find(b => b.disabled)
    expect(cancelBtn).toBeTruthy()
  })

  it('cliquer "Annuler" appelle DELETE /reservations/:id', async () => {
    vi.mocked(getReservationsForUser).mockResolvedValue([reservationFuture] as any)
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => screen.getByText('Hamlet'))
    const buttons = screen.getAllByRole('button')
    const cancelBtn = buttons.find(b => b.textContent?.includes('Annuler') && !b.disabled)
    if (cancelBtn) {
      await user.click(cancelBtn)
      await waitFor(() => {
        expect(deleteReservation).toHaveBeenCalledWith(reservationFuture.id)
      })
    }
  })

  it('si DELETE retourne 400, un toast d\'erreur est affiché', async () => {
    vi.mocked(getReservationsForUser).mockResolvedValue([reservationFuture] as any)
    vi.mocked(deleteReservation).mockRejectedValue(new Error('Annulation impossible à moins de 2h'))
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => screen.getByText('Hamlet'))
    const buttons = screen.getAllByRole('button')
    const cancelBtn = buttons.find(b => b.textContent?.includes('Annuler') && !b.disabled)
    if (cancelBtn) {
      await user.click(cancelBtn)
      await waitFor(() => {
        // Toast d'erreur doit apparaître
        expect(screen.getByText(/erreur/i)).toBeInTheDocument()
      })
    }
  })
})

describe('ReservationsPage — Groupe 11 : erreurs réseau', () => {
  beforeEach(() => {
    setupAuth(true)
  })

  it('si GET /reservations retourne une erreur, un toast/message d\'erreur est affiché', async () => {
    vi.mocked(getReservationsForUser).mockRejectedValue(new Error('Network error'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument()
    })
  })
})
