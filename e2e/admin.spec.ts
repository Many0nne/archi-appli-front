import { test, expect, type Page } from '@playwright/test'
import { spectaclesFutures, spectaclesPassees, adminStats, mockAdmin } from '../src/test/msw/fixtures'

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

let currentSpectacles = [...spectaclesFutures]

async function loginAsAdmin(page: Page) {
  await page.evaluate((user) => {
    localStorage.setItem('test-auth', JSON.stringify({ token: 'mock-token-admin', user }))
  }, mockAdmin)
}

async function mockAdminAPIs(page: Page) {
  currentSpectacles = [...spectaclesFutures]

  await page.route('**/api/spectacles', async (route) => {
    const method = route.request().method()
    if (method === 'GET') {
      await route.fulfill({ json: paginate(currentSpectacles) })
    } else if (method === 'POST') {
      const body = route.request().postDataJSON() as any
      const newSpectacle = { ...body, id: 999 }
      currentSpectacles = [...currentSpectacles, newSpectacle]
      await route.fulfill({ json: newSpectacle, status: 201 })
    } else {
      await route.continue()
    }
  })

  await page.route('**/api/spectacles/*', async (route) => {
    const method = route.request().method()
    const url = route.request().url()
    const id = Number(url.split('/').pop())

    if (method === 'PUT') {
      const body = route.request().postDataJSON() as any
      currentSpectacles = currentSpectacles.map(s => s.id === id ? { ...s, ...body } : s)
      await route.fulfill({ json: { ...body, id } })
    } else if (method === 'DELETE') {
      currentSpectacles = currentSpectacles.filter(s => s.id !== id)
      await route.fulfill({ status: 204, body: '' })
    } else {
      const spectacle = currentSpectacles.find(s => s.id === id)
      if (spectacle) {
        await route.fulfill({ json: spectacle })
      } else {
        await route.fulfill({ status: 404, body: 'Not found' })
      }
    }
  })

  await page.route('**/api/admin/stats', async (route) => {
    await route.fulfill({ json: adminStats })
  })
}

test.describe('Admin — Groupe 10 : CRUD spectacles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await loginAsAdmin(page)
    await mockAdminAPIs(page)
    await page.goto('/admin')
    await expect(page.getByText(/administration/i).first()).toBeVisible({ timeout: 10000 })
  })

  test('admin crée un spectacle → apparaît dans le tableau', async ({ page }) => {
    // Cliquer "Créer"
    await page.getByText('Créer').click()

    const dialog = page.locator('.p-dialog')
    await expect(dialog).toBeVisible({ timeout: 5000 })

    // Remplir le formulaire
    await dialog.getByLabel('Titre').fill('Don Giovanni')
    await dialog.getByLabel('Description').fill('Opéra de Mozart')
    await dialog.getByLabel('Image URL').fill('/don-giovanni.jpg')

    // Prix et places (InputNumber) — utiliser clavier
    const priceInput = dialog.locator('input').nth(3)
    await priceInput.fill('40')

    const ticketsInput = dialog.locator('input').nth(4)
    await ticketsInput.fill('15')

    // Enregistrer
    await dialog.getByText('Enregistrer').click()
    await page.waitForTimeout(1000)

    await expect(page.getByText('Don Giovanni')).toBeVisible({ timeout: 5000 })
  })

  test('admin supprime un spectacle → disparaît du tableau après confirmation', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept())

    await expect(page.getByText('Hamlet').first()).toBeVisible({ timeout: 10000 })

    // Trouver le bouton supprimer pour Hamlet
    const hamletRow = page.locator('tr').filter({ hasText: 'Hamlet' }).first()
    const deleteBtn = hamletRow.locator('[aria-label="Supprimer"], button').last()
    await deleteBtn.click()

    await page.waitForTimeout(1500)
    await expect(page.getByText('Hamlet')).not.toBeVisible()
  })

  test('admin modifie le titre d\'un spectacle → nouveau titre visible dans le tableau', async ({ page }) => {
    await expect(page.getByText('Hamlet').first()).toBeVisible({ timeout: 10000 })

    const hamletRow = page.locator('tr').filter({ hasText: 'Hamlet' }).first()
    const editBtn = hamletRow.locator('[aria-label="Modifier"], button').first()
    await editBtn.click()

    const dialog = page.locator('.p-dialog')
    await expect(dialog).toBeVisible({ timeout: 5000 })

    const titleInput = dialog.getByLabel('Titre')
    await titleInput.clear()
    await titleInput.fill('Hamlet Modifié')

    await dialog.getByText('Enregistrer').click()
    await page.waitForTimeout(1000)

    await expect(page.getByText('Hamlet Modifié')).toBeVisible({ timeout: 5000 })
  })
})
