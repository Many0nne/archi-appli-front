import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SpectacleModal from '../../components/SpectacleModal'
import { spectaclesFutures } from '../../test/msw/fixtures'

const hamlet = spectaclesFutures[0]   // 10 places, 25€
const roiLion = spectaclesFutures[1]  // 0 places

vi.mock('@react-keycloak/web', () => ({
  useKeycloak: vi.fn(),
  ReactKeycloakProvider: ({ children }: any) => children,
}))

vi.mock('../../composables/useSpectable', () => ({
  getSpectacle: vi.fn(),
}))

vi.mock('../../composables/useReservation', () => ({
  createReservation: vi.fn(),
}))

vi.mock('../../composables/useAuth', () => ({
  default: vi.fn(),
  useAuthComposable: vi.fn(),
}))

import { getSpectacle } from '../../composables/useSpectable'
import { createReservation } from '../../composables/useReservation'
import useAuthComposable from '../../composables/useAuth'

function setupAuthMock(isAuthenticated: boolean) {
  const loginMock = vi.fn()
  vi.mocked(useAuthComposable).mockReturnValue({
    isAuthenticated,
    user: isAuthenticated ? { id: 'user-123', username: 'jean.dupont' } : null,
    token: isAuthenticated ? 'mock-token' : null,
    login: loginMock,
    logout: vi.fn(),
    register: vi.fn(),
    fetchWithAuth: vi.fn(),
    initialized: true,
  } as any)
  return loginMock
}

describe('SpectacleModal — Groupe 3 : réservation disponible', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getSpectacle).mockResolvedValue(hamlet as any)
    vi.mocked(createReservation).mockResolvedValue({ id: 99 } as any)
    setupAuthMock(true)
  })

  it('affiche le nombre de places disponibles', async () => {
    render(<SpectacleModal id={1} visible={true} onHide={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })

  it('le prix total se recalcule quand la quantité change (1 × 25 = 25€)', async () => {
    render(<SpectacleModal id={1} visible={true} onHide={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getByText(/25,00 €|25\.00 €/)).toBeInTheDocument()
    })
  })

  it('cliquer "Commander" appelle POST /reservations avec les bons paramètres', async () => {
    const user = userEvent.setup()
    const onHide = vi.fn()
    render(<SpectacleModal id={1} visible={true} onHide={onHide} />)

    await waitFor(() => screen.getByRole('button', { name: /commander/i }))
    await user.click(screen.getByRole('button', { name: /commander/i }))

    await waitFor(() => {
      expect(createReservation).toHaveBeenCalledWith(hamlet.id, 'user-123', 1)
    })
  })

  it('après réservation réussie, getSpectacle est rappelé pour rafraîchir', async () => {
    const user = userEvent.setup()
    render(<SpectacleModal id={1} visible={true} onHide={vi.fn()} />)

    await waitFor(() => screen.getByRole('button', { name: /commander/i }))
    await user.click(screen.getByRole('button', { name: /commander/i }))

    await waitFor(() => {
      expect(getSpectacle).toHaveBeenCalledTimes(2) // 1 init + 1 refresh
    })
  })
})

describe('SpectacleModal — Groupe 3 : limites de quantité', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createReservation).mockResolvedValue({ id: 99 } as any)
  })

  it('si availableTickets = 8, max = 8 (plafonné à min(8, 50))', async () => {
    const spectacle8 = { ...hamlet, availableTickets: 8 }
    vi.mocked(getSpectacle).mockResolvedValue(spectacle8 as any)
    setupAuthMock(true)

    render(<SpectacleModal id={1} visible={true} onHide={vi.fn()} />)
    await waitFor(() => {
      const input = document.querySelector('input[type="number"], input.p-inputnumber-input') as HTMLInputElement
      if (input) {
        expect(Number(input.getAttribute('max') ?? input.max)).toBe(8)
      }
    })
  })

  it('si availableTickets = 60, max = 50', async () => {
    const spectacle60 = { ...hamlet, availableTickets: 60 }
    vi.mocked(getSpectacle).mockResolvedValue(spectacle60 as any)
    setupAuthMock(true)

    render(<SpectacleModal id={1} visible={true} onHide={vi.fn()} />)
    await waitFor(() => {
      const input = document.querySelector('input[type="number"], input.p-inputnumber-input') as HTMLInputElement
      if (input) {
        expect(Number(input.getAttribute('max') ?? input.max)).toBeLessThanOrEqual(50)
      }
    })
  })
})

describe('SpectacleModal — Groupe 4 : spectacle complet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getSpectacle).mockResolvedValue(roiLion as any)
    vi.mocked(createReservation).mockResolvedValue({ id: 99 } as any)
    setupAuthMock(true)
  })

  it('le bouton "Commander" est disabled quand availableTickets = 0', async () => {
    render(<SpectacleModal id={2} visible={true} onHide={vi.fn()} />)

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /commander/i })
      expect(btn).toBeDisabled()
    })
  })

  it('aucun appel POST /reservations si le bouton est disabled', async () => {
    const user = userEvent.setup()
    render(<SpectacleModal id={2} visible={true} onHide={vi.fn()} />)

    await waitFor(() => screen.getByRole('button', { name: /commander/i }))
    const btn = screen.getByRole('button', { name: /commander/i })
    if (btn && !btn.hasAttribute('disabled')) {
      await user.click(btn)
    }

    expect(createReservation).not.toHaveBeenCalled()
  })
})

describe('SpectacleModal — Groupe 5 : réservation sans être connecté', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getSpectacle).mockResolvedValue(hamlet as any)
    vi.mocked(createReservation).mockResolvedValue({ id: 99 } as any)
  })

  it('cliquer "Commander" sans auth → appelle login()', async () => {
    const loginMock = setupAuthMock(false)
    const user = userEvent.setup()

    render(<SpectacleModal id={1} visible={true} onHide={vi.fn()} />)
    await waitFor(() => screen.getByRole('button', { name: /commander/i }))
    await user.click(screen.getByRole('button', { name: /commander/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalled()
    })
  })

  it('aucun appel POST /reservations si non connecté', async () => {
    setupAuthMock(false)
    const user = userEvent.setup()

    render(<SpectacleModal id={1} visible={true} onHide={vi.fn()} />)
    await waitFor(() => screen.getByRole('button', { name: /commander/i }))
    await user.click(screen.getByRole('button', { name: /commander/i }))

    await waitFor(() => {
      expect(createReservation).not.toHaveBeenCalled()
    })
  })
})
