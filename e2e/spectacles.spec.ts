import { test, expect, type Page } from '@playwright/test'
import { spectaclesFutures, spectaclesPassees } from '../src/test/msw/fixtures'

const API_BASE = process.env.VITE_API_BASE ?? 'http://localhost:8080/api'

function paginate<T>(content: T[]) {
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    size: 20,
    number: 0,
    first: true,
    last: true,
    empty: content.length === 0,
    numberOfElements: content.length,
    pageable: { pageNumber: 0, pageSize: 20, offset: 0 },
    sort: { empty: true, sorted: false, unsorted: true },
  }
}

async function mockSpectaclesAPI(page: Page) {
  const allSpectacles = [...spectaclesFutures, ...spectaclesPassees]

  await page.route('**/api/spectacles*', async (route) => {
    const url = new URL(route.request().url())
    const search = url.searchParams.get('search')

    if (search) {
      const q = search.toLowerCase()
      const filtered = allSpectacles.filter(
        s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      )
      await route.fulfill({ json: paginate(filtered) })
    } else {
      await route.fulfill({ json: paginate(allSpectacles) })
    }
  })

  await page.route('**/api/spectacles/*', async (route) => {
    const url = route.request().url()
    const id = Number(url.split('/').pop())
    const spectacle = allSpectacles.find(s => s.id === id)
    if (spectacle) {
      await route.fulfill({ json: spectacle })
    } else {
      await route.fulfill({ status: 404, body: 'Not found' })
    }
  })
}

test.describe('Spectacles — Groupe 1 : affichage de la liste', () => {
  test.beforeEach(async ({ page }) => {
    await mockSpectaclesAPI(page)
    await page.goto('/spectacles')
  })

  test('la page /spectacles charge et affiche au moins une carte de spectacle', async ({ page }) => {
    await expect(page.locator('.p-card, [class*="spectacle-card"]').first()).toBeVisible({ timeout: 10000 })
  })

  test('la carte "Hamlet" (10 places) affiche "10 places" et son bouton est actif', async ({ page }) => {
    await expect(page.getByText('Hamlet').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/10 place/)).toBeVisible()

    // Le bouton réserver d'Hamlet doit être actif
    const hamletCard = page.locator('[class*="spectacle-card"]').filter({ hasText: 'Hamlet' })
    const btn = hamletCard.getByRole('button').first()
    await expect(btn).not.toBeDisabled()
  })

  test('la carte "Le Roi Lion" (0 places) affiche "Complet" et son bouton est disabled', async ({ page }) => {
    await expect(page.getByText('Le Roi Lion').first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Complet').first()).toBeVisible()

    const roiLionCard = page.locator('[class*="spectacle-card"]').filter({ hasText: 'Le Roi Lion' })
    const btn = roiLionCard.getByRole('button').first()
    await expect(btn).toBeDisabled()
  })

  test('la carte "Othello" (passé, 2020) n\'est pas visible dans la liste', async ({ page }) => {
    await page.waitForSelector('.p-card, [class*="spectacle-card"]', { timeout: 10000 })
    await expect(page.getByText('Othello')).not.toBeVisible()
  })
})

test.describe('Spectacles — Groupe 2 : recherche', () => {
  test.beforeEach(async ({ page }) => {
    await mockSpectaclesAPI(page)
    await page.goto('/spectacles')
  })

  test('taper "Shakespeare" affiche uniquement les spectacles contenant ce terme', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/rechercher/i)
    await searchInput.fill('Shakespeare')

    await page.waitForTimeout(400) // debounce 300ms
    await expect(page.getByText('Hamlet').first()).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Le Roi Lion')).not.toBeVisible()
    await expect(page.getByText('Carmen')).not.toBeVisible()
  })

  test('taper un terme sans résultat affiche un message vide', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/rechercher/i)
    await searchInput.fill('xyztermeintrouvable')

    await page.waitForTimeout(400)
    await expect(page.getByText(/aucun spectacle trouvé/i)).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Spectacles — Groupe 4 : spectacle complet (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await mockSpectaclesAPI(page)
    await page.goto('/spectacles')
    await expect(page.getByText('Le Roi Lion').first()).toBeVisible({ timeout: 10000 })
  })

  test('ouvrir la modal de "Le Roi Lion" (0 places) → bouton "Commander" est disabled', async ({ page }) => {
    const roiLionCard = page.locator('[class*="spectacle-card"]').filter({ hasText: 'Le Roi Lion' })
    await roiLionCard.click()

    const modal = page.locator('.p-dialog')
    await expect(modal).toBeVisible({ timeout: 5000 })
    const commanderBtn = modal.getByText('Commander')
    await expect(commanderBtn.first()).toBeVisible()

    const btn = commanderBtn.first().locator('xpath=ancestor-or-self::button')
    await expect(btn.first()).toBeDisabled()
  })

  test('aucun appel POST /reservations émis si bouton Commander est disabled', async ({ page }) => {
    let postCalled = false
    await page.route('**/api/reservations', async (route) => {
      if (route.request().method() === 'POST') {
        postCalled = true
      }
      await route.continue()
    })

    const roiLionCard = page.locator('[class*="spectacle-card"]').filter({ hasText: 'Le Roi Lion' })
    await roiLionCard.click()

    const modal = page.locator('.p-dialog')
    await expect(modal).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(500)

    expect(postCalled).toBe(false)
  })
})
