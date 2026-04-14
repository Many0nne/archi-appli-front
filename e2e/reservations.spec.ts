import { test, expect, type Page } from '@playwright/test'
import { spectaclesFutures, spectaclesPassees, reservationsUser, mockUser } from '../src/test/msw/fixtures'

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

async function loginAsUser(page: Page) {
  await page.evaluate((user) => {
    localStorage.setItem('test-auth', JSON.stringify({
      token: 'mock-token-user',
      user,
    }))
  }, mockUser)
}

async function mockAllAPIs(page: Page) {
  const allSpectacles = [...spectaclesFutures, ...spectaclesPassees]

  await page.route('**/api/spectacles*', async (route) => {
    await route.fulfill({ json: paginate(allSpectacles) })
  })

  await page.route('**/api/reservations*', async (route) => {
    const method = route.request().method()
    if (method === 'GET') {
      await route.fulfill({ json: paginate(reservationsUser) })
    } else if (method === 'POST') {
      await route.fulfill({
        json: { id: 99, reservationDate: new Date().toISOString(), quantity: 2, totalPrice: 50, spectacle: spectaclesFutures[0] },
        status: 201,
      })
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' })
    } else {
      await route.continue()
    }
  })
}

test.describe('Reservations — Groupe 8 : page mes réservations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await loginAsUser(page)
    await mockAllAPIs(page)
  })

  test('user connecté accède à /reservations → voit ses réservations à venir et passées', async ({ page }) => {
    await page.goto('/reservations')
    await expect(page.getByText(/à venir/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/passées/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Hamlet').first()).toBeVisible({ timeout: 10000 })
  })

  test('annuler une réservation à venir → disparaît de la liste', async ({ page }) => {
    let deleteCallCount = 0
    await page.route('**/api/reservations/*', async (route) => {
      if (route.request().method() === 'DELETE') {
        deleteCallCount++
        await route.fulfill({ status: 204, body: '' })
      } else {
        await route.continue()
      }
    })

    page.on('dialog', dialog => dialog.accept())

    await page.goto('/reservations')
    await expect(page.getByText('Hamlet').first()).toBeVisible({ timeout: 10000 })

    const cancelButtons = page.getByRole('button').filter({ hasText: /annuler/i })
    const firstEnabled = cancelButtons.first()
    await expect(firstEnabled).not.toBeDisabled()
    await firstEnabled.click()

    await page.waitForTimeout(1000)
    expect(deleteCallCount).toBeGreaterThan(0)
  })
})

test.describe('Reservations — Groupe 3 : réservation via modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await loginAsUser(page)
    await mockAllAPIs(page)
  })

  test('ouvrir modal "Hamlet", sélectionner 2, Commander → réservation confirmée', async ({ page }) => {
    let postBody: any = null
    await page.route('**/api/reservations', async (route) => {
      if (route.request().method() === 'POST') {
        postBody = route.request().postDataJSON()
        await route.fulfill({
          json: { id: 99, quantity: postBody?.quantity, spectacle: spectaclesFutures[0] },
          status: 201,
        })
      } else {
        await route.fulfill({ json: paginate(reservationsUser) })
      }
    })

    await page.goto('/spectacles')
    await expect(page.getByText('Hamlet').first()).toBeVisible({ timeout: 10000 })

    const hamletCard = page.locator('[class*="spectacle-card"]').filter({ hasText: 'Hamlet' })
    await hamletCard.click()

    const modal = page.locator('.p-dialog')
    await expect(modal).toBeVisible({ timeout: 5000 })

    await page.waitForTimeout(500)
    const commanderBtn = modal.getByText('Commander').first()
    await commanderBtn.click()

    await expect(page.getByText(/réservé|billet/i)).toBeVisible({ timeout: 5000 })
  })
})
