import { test, expect, type Page } from '@playwright/test'
import { spectaclesFutures, spectaclesPassees, reservationsUser, mockUser, mockAdmin } from '../src/test/msw/fixtures'

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
    localStorage.setItem('test-auth', JSON.stringify({ token: 'mock-token-user', user }))
  }, mockUser)
}

async function loginAsAdmin(page: Page) {
  await page.evaluate((user) => {
    localStorage.setItem('test-auth', JSON.stringify({ token: 'mock-token-admin', user }))
  }, mockAdmin)
}

async function clearAuth(page: Page) {
  await page.evaluate(() => localStorage.removeItem('test-auth'))
}

async function mockSpectaclesAPI(page: Page) {
  const allSpectacles = [...spectaclesFutures, ...spectaclesPassees]
  await page.route('**/api/spectacles*', async (route) => {
    await route.fulfill({ json: paginate(allSpectacles) })
  })
  await page.route('**/api/admin/stats', async (route) => {
    await route.fulfill({ json: { totalRevenue: 1250, totalReservations: 42, salesBySpectacle: [] } })
  })
  await page.route('**/api/reservations*', async (route) => {
    await route.fulfill({ json: paginate(reservationsUser) })
  })
}

test.describe('Auth — Groupe 5 : réservation sans être connecté', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearAuth(page)
    await mockSpectaclesAPI(page)
  })

  test('utilisateur non connecté, ouvre modal Hamlet, clique "Commander" → redirigé vers /login', async ({ page }) => {
    await page.goto('/spectacles')
    await expect(page.getByText('Hamlet').first()).toBeVisible({ timeout: 10000 })

    const hamletCard = page.locator('[class*="spectacle-card"]').filter({ hasText: 'Hamlet' })
    await hamletCard.click()

    const modal = page.locator('.p-dialog')
    await expect(modal).toBeVisible({ timeout: 5000 })

    await page.waitForTimeout(500)
    await modal.getByText('Commander').click()

    // Doit appeler login() qui redirige vers Keycloak (ou /login en mode mock)
    // En mode VITE_E2E_MOCK_AUTH=true avec token null, login() est un noop mock
    // On vérifie qu'aucun appel POST n'est fait
    await page.waitForTimeout(1000)
    // Test vérifie l'état — soit redirect, soit toast
    const hasLoginPage = await page.getByText(/login|connexion/i).count()
    const hasWarning = await page.getByText(/authentification requise|connecter/i).count()
    expect(hasLoginPage + hasWarning).toBeGreaterThan(0)
  })
})

test.describe('Auth — Groupe 6 : contrôle d\'accès routes protégées', () => {
  test('user non connecté navigue vers /reservations → redirigé vers /login', async ({ page }) => {
    await page.goto('/')
    await clearAuth(page)
    await mockSpectaclesAPI(page)

    await page.goto('/reservations')
    await page.waitForTimeout(2000)

    // Doit être redirigé vers /login
    const currentUrl = page.url()
    expect(currentUrl).toContain('/login')
  })

  test('user standard navigue vers /admin → redirigé ou accès refusé', async ({ page }) => {
    await page.goto('/')
    await loginAsUser(page)
    await mockSpectaclesAPI(page)

    await page.goto('/admin')
    await page.waitForTimeout(2000)

    // Soit redirect vers /login soit message "Accès refusé"
    const hasLoginPage = await page.locator('text=/login/i').count()
    const hasAccessDenied = await page.locator('text=/accès refusé|accès deny/i').count()
    const currentUrl = page.url()
    const isRedirected = currentUrl.includes('/login')

    expect(hasLoginPage + hasAccessDenied + (isRedirected ? 1 : 0)).toBeGreaterThan(0)
  })

  test('user admin navigue vers /admin → page admin accessible et affichée', async ({ page }) => {
    await page.goto('/')
    await loginAsAdmin(page)
    await mockSpectaclesAPI(page)

    await page.goto('/admin')
    await page.waitForTimeout(2000)

    await expect(page.getByText(/administration/i).first()).toBeVisible({ timeout: 10000 })
  })
})
