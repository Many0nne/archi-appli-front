import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/msw/handlers'
import {
  createReservation,
  deleteReservation,
  getReservationsForUser,
  getReservation,
} from '../../composables/useReservation'
import { reservationsUser } from '../../test/msw/fixtures'

const BASE = 'http://localhost:3000/api'

describe('useReservation — Groupe 3 : création de réservation', () => {
  it('createReservation appelle POST /reservations avec les bons paramètres', async () => {
    let capturedBody: any = null
    server.use(
      http.post(`${BASE}/reservations`, async ({ request }) => {
        capturedBody = await request.json()
        return HttpResponse.json({ id: 99 }, { status: 201 })
      })
    )

    await createReservation(1, 'user-123', 3)
    expect(capturedBody).toEqual({ spectacleId: 1, userId: 'user-123', quantity: 3 })
  })

  it('createReservation retourne la réservation créée', async () => {
    const result = await createReservation(1, 'user-123', 2)
    expect(result).toBeDefined()
    expect(result.id).toBe(99)
  })

  it('createReservation avec userId UUID Keycloak', async () => {
    let capturedBody: any = null
    server.use(
      http.post(`${BASE}/reservations`, async ({ request }) => {
        capturedBody = await request.json()
        return HttpResponse.json({ id: 100 }, { status: 201 })
      })
    )

    await createReservation(1, 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 1)
    expect(capturedBody.userId).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479')
  })
})

describe('useReservation — Groupe 8 : liste et suppression', () => {
  it('getReservationsForUser retourne les réservations de l\'utilisateur', async () => {
    const result = await getReservationsForUser('user-123')
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(reservationsUser.length)
  })

  it('deleteReservation appelle DELETE /reservations/:id', async () => {
    let deletedId: string | undefined
    server.use(
      http.delete(`${BASE}/reservations/:id`, ({ params }) => {
        deletedId = params.id as string
        return new HttpResponse(null, { status: 204 })
      })
    )

    await deleteReservation(10)
    expect(deletedId).toBe('10')
  })

  it('deleteReservation avec id "late-cancel-id" lève une erreur 400', async () => {
    server.use(
      http.delete(`${BASE}/reservations/late-cancel-id`, () =>
        HttpResponse.json({ message: 'Annulation impossible à moins de 2h du spectacle' }, { status: 400 })
      )
    )

    await expect(deleteReservation('late-cancel-id' as any)).rejects.toThrow(/400/)
  })
})

describe('useReservation — Groupe 11 : erreurs réseau', () => {
  it('POST /reservations retourne 500 → createReservation lève une erreur', async () => {
    server.use(
      http.post(`${BASE}/reservations`, () => new HttpResponse(null, { status: 500 }))
    )

    await expect(createReservation(1, 'user-123', 1)).rejects.toThrow()
  })

  it('DELETE /reservations/:id retourne 500 → deleteReservation lève une erreur', async () => {
    server.use(
      http.delete(`${BASE}/reservations/10`, () => new HttpResponse(null, { status: 500 }))
    )

    await expect(deleteReservation(10)).rejects.toThrow()
  })
})
