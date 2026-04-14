import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/msw/handlers'
import { getStats, createSpectacle, updateSpectacle, deleteSpectacle } from '../../composables/useStats'
import { adminStats, spectaclesFutures } from '../../test/msw/fixtures'

const BASE = 'http://localhost:3000/api'

const newSpectacle = {
  id: 0,
  title: 'Don Giovanni',
  description: 'Opéra de Mozart',
  date: '2099-09-01T20:00:00',
  price: 40.00,
  availableTickets: 20,
  imageUrl: '/don-giovanni.jpg',
}

describe('useStats — Groupe 9 : statistiques admin', () => {
  it('getStats() retourne les statistiques exactes de la fixture', async () => {
    const stats = await getStats()
    expect(stats.totalRevenue).toBe(1250.00)
    expect(stats.totalReservations).toBe(42)
  })

  it('getStats() retourne un tableau salesBySpectacle', async () => {
    const stats = await getStats()
    expect(Array.isArray(stats.salesBySpectacle)).toBe(true)
    expect(stats.salesBySpectacle).toHaveLength(2)
  })

  it('salesBySpectacle contient Hamlet avec 30 billets et 750€', async () => {
    const stats = await getStats()
    const hamlet = stats.salesBySpectacle.find((s: any) => s.title === 'Hamlet')
    expect(hamlet).toBeDefined()
    expect(hamlet?.ticketsSold).toBe(30)
    expect(hamlet?.revenue).toBe(750.00)
  })

  it('salesBySpectacle contient Carmen avec 20 billets et 700€', async () => {
    const stats = await getStats()
    const carmen = stats.salesBySpectacle.find((s: any) => s.title === 'Carmen')
    expect(carmen).toBeDefined()
    expect(carmen?.ticketsSold).toBe(20)
    expect(carmen?.revenue).toBe(700.00)
  })
})

describe('useStats — Groupe 10 : CRUD spectacles', () => {
  it('createSpectacle appelle POST /spectacles avec les bonnes données', async () => {
    let capturedBody: any = null
    server.use(
      http.post(`${BASE}/spectacles`, async ({ request }) => {
        capturedBody = await request.json()
        return HttpResponse.json({ ...capturedBody, id: 100 }, { status: 201 })
      })
    )

    const { id: _omit, ...payload } = newSpectacle as any
    await createSpectacle(payload)
    expect(capturedBody.title).toBe('Don Giovanni')
    expect(capturedBody.price).toBe(40.00)
  })

  it('createSpectacle retourne le spectacle créé avec un id', async () => {
    const { id: _omit, ...payload } = newSpectacle as any
    const created = await createSpectacle(payload)
    expect(created).toBeDefined()
    expect(created.id).toBeGreaterThan(0)
  })

  it('updateSpectacle appelle PUT /spectacles/:id avec les nouvelles données', async () => {
    let capturedBody: any = null
    let capturedId: string | undefined
    server.use(
      http.put(`${BASE}/spectacles/:id`, async ({ params, request }) => {
        capturedId = params.id as string
        capturedBody = await request.json()
        return HttpResponse.json({ ...capturedBody, id: Number(capturedId) })
      })
    )

    await updateSpectacle(1, { ...spectaclesFutures[0], title: 'Hamlet II' } as any)
    expect(capturedId).toBe('1')
    expect(capturedBody.title).toBe('Hamlet II')
  })

  it('deleteSpectacle appelle DELETE /spectacles/:id', async () => {
    let deletedId: string | undefined
    server.use(
      http.delete(`${BASE}/spectacles/:id`, ({ params }) => {
        deletedId = params.id as string
        return new HttpResponse(null, { status: 204 })
      })
    )

    await deleteSpectacle(1)
    expect(deletedId).toBe('1')
  })
})

describe('useStats — Groupe 11 : erreurs réseau', () => {
  it('GET /admin/stats retourne 500 → getStats() lève une erreur', async () => {
    server.use(
      http.get(`${BASE}/admin/stats`, () => new HttpResponse(null, { status: 500 }))
    )

    await expect(getStats()).rejects.toThrow()
  })

  it('POST /spectacles retourne 500 → createSpectacle() lève une erreur', async () => {
    server.use(
      http.post(`${BASE}/spectacles`, () => new HttpResponse(null, { status: 500 }))
    )

    await expect(createSpectacle(newSpectacle as any)).rejects.toThrow()
  })
})
