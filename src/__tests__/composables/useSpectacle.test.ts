import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/msw/handlers'
import { getSpectacles, getSpectacle } from '../../composables/useSpectable'
import { spectaclesFutures, spectaclesPassees } from '../../test/msw/fixtures'

const BASE = 'http://localhost:3000/api'

function paginate<T>(content: T[]) {
  return { content, totalElements: content.length, totalPages: 1, size: 20, number: 0, first: true, last: true, empty: content.length === 0 }
}

describe('useSpectacle — Groupe 1 : récupération des spectacles', () => {
  it('getSpectacles() retourne tous les spectacles (futur + passé)', async () => {
    const spectacles = await getSpectacles()
    expect(spectacles.length).toBeGreaterThanOrEqual(spectaclesFutures.length)
  })

  it('getSpectacles() retourne un tableau (contenu paginé)', async () => {
    const spectacles = await getSpectacles()
    expect(Array.isArray(spectacles)).toBe(true)
  })

  it('getSpectacle(1) retourne Hamlet', async () => {
    const spectacle = await getSpectacle(1)
    expect(spectacle.title).toBe('Hamlet')
    expect(spectacle.availableTickets).toBe(10)
  })

  it('getSpectacle(4) retourne Othello (passé)', async () => {
    const spectacle = await getSpectacle(4)
    expect(spectacle.title).toBe('Othello')
  })
})

describe('useSpectacle — Groupe 2 : recherche via API', () => {
  it('getSpectacles("hamlet") déclenche GET /spectacles?search=hamlet', async () => {
    let capturedUrl = ''
    server.use(
      http.get(`${BASE}/spectacles`, ({ request }) => {
        capturedUrl = request.url
        const url = new URL(request.url)
        const search = url.searchParams.get('search')
        const q = search?.toLowerCase() ?? ''
        const all = [...spectaclesFutures, ...spectaclesPassees]
        const filtered = all.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
        return HttpResponse.json(paginate(filtered))
      })
    )

    await getSpectacles('hamlet')
    expect(capturedUrl).toContain('search=hamlet')
  })

  it('getSpectacles("HAMLET") transmet le terme en minuscules ou original', async () => {
    let capturedSearch = ''
    server.use(
      http.get(`${BASE}/spectacles`, ({ request }) => {
        const url = new URL(request.url)
        capturedSearch = url.searchParams.get('search') ?? ''
        return HttpResponse.json(paginate([]))
      })
    )

    await getSpectacles('HAMLET')
    expect(capturedSearch.toLowerCase()).toBe('hamlet')
  })

  it('si la recherche retourne un tableau vide, getSpectacles retourne []', async () => {
    server.use(
      http.get(`${BASE}/spectacles`, () => HttpResponse.json(paginate([])))
    )

    const result = await getSpectacles('xyz-aucun-resultat')
    expect(result).toEqual([])
  })

  it('getSpectacles() sans param recharge tous les spectacles (pas de ?search)', async () => {
    let capturedUrl = ''
    server.use(
      http.get(`${BASE}/spectacles`, ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json(paginate(spectaclesFutures))
      })
    )

    await getSpectacles()
    expect(capturedUrl).not.toContain('search=')
  })

  it('si la recherche retourne des résultats, seuls les spectacles correspondants sont retournés', async () => {
    server.use(
      http.get(`${BASE}/spectacles`, ({ request }) => {
        const url = new URL(request.url)
        const search = url.searchParams.get('search')
        if (search?.toLowerCase() === 'hamlet') {
          return HttpResponse.json(paginate([spectaclesFutures[0]]))
        }
        return HttpResponse.json(paginate(spectaclesFutures))
      })
    )

    const result = await getSpectacles('hamlet')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Hamlet')
  })
})

describe('useSpectacle — Groupe 11 : erreurs réseau', () => {
  it('GET /spectacles retourne 500 → getSpectacles() lève une erreur', async () => {
    server.use(
      http.get(`${BASE}/spectacles`, () => new HttpResponse(null, { status: 500 }))
    )

    await expect(getSpectacles()).rejects.toThrow()
  })

  it('GET /spectacles/:id retourne 404 → getSpectacle() lève une erreur', async () => {
    server.use(
      http.get(`${BASE}/spectacles/999`, () => new HttpResponse(null, { status: 404 }))
    )

    await expect(getSpectacle(999)).rejects.toThrow()
  })
})
