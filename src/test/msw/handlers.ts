import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { spectaclesFutures, spectaclesPassees, reservationsUser, adminStats } from './fixtures'

const BASE = 'http://localhost:3000/api'

const allSpectacles = [...spectaclesFutures, ...spectaclesPassees]

function paginate<T>(content: T[]) {
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    size: content.length,
    number: 0,
    first: true,
    last: true,
    empty: content.length === 0,
    numberOfElements: content.length,
    pageable: { pageNumber: 0, pageSize: 20, offset: 0, paged: true, unpaged: false, sort: { empty: true, sorted: false, unsorted: true } },
    sort: { empty: true, sorted: false, unsorted: true },
  }
}

let nextSpectacleId = 100

export const handlers = [
  // GET /spectacles (with optional search)
  http.get(`${BASE}/spectacles`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    if (search) {
      const q = search.toLowerCase()
      const filtered = allSpectacles.filter(
        s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      )
      return HttpResponse.json(paginate(filtered))
    }
    return HttpResponse.json(paginate(allSpectacles))
  }),

  // GET /spectacles/:id
  http.get(`${BASE}/spectacles/:id`, ({ params }) => {
    const id = Number(params.id)
    const spectacle = allSpectacles.find(s => s.id === id)
    if (!spectacle) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(spectacle)
  }),

  // POST /spectacles
  http.post(`${BASE}/spectacles`, async ({ request }) => {
    const body = await request.json() as any
    const created = { ...body, id: nextSpectacleId++ }
    return HttpResponse.json(created, { status: 201 })
  }),

  // PUT /spectacles/:id
  http.put(`${BASE}/spectacles/:id`, async ({ params, request }) => {
    const id = Number(params.id)
    const body = await request.json() as any
    const updated = { ...body, id }
    return HttpResponse.json(updated)
  }),

  // DELETE /spectacles/:id
  http.delete(`${BASE}/spectacles/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // GET /reservations?userId=...
  http.get(`${BASE}/reservations`, ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    if (userId) {
      return HttpResponse.json(paginate(reservationsUser))
    }
    return HttpResponse.json(paginate(reservationsUser))
  }),

  // POST /reservations
  http.post(`${BASE}/reservations`, async ({ request }) => {
    const body = await request.json() as any
    const created = {
      id: 99,
      reservationDate: new Date().toISOString(),
      quantity: body.quantity,
      totalPrice: body.quantity * 25,
      spectacle: spectaclesFutures.find(s => s.id === body.spectacleId) ?? spectaclesFutures[0],
    }
    return HttpResponse.json(created, { status: 201 })
  }),

  // DELETE /reservations/:id
  http.delete(`${BASE}/reservations/:id`, ({ params }) => {
    if (params.id === 'late-cancel-id') {
      return HttpResponse.json(
        { message: 'Annulation impossible à moins de 2h du spectacle' },
        { status: 400 }
      )
    }
    return new HttpResponse(null, { status: 204 })
  }),

  // GET /admin/stats
  http.get(`${BASE}/admin/stats`, () => {
    return HttpResponse.json(adminStats)
  }),
]

export const server = setupServer(...handlers)
