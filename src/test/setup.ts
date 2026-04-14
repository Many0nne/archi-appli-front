import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach, vi } from 'vitest'
import { server } from './msw/handlers'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock keycloak config so apiCall doesn't throw when no Keycloak instance is running
vi.mock('../config/keycloak', () => ({
  getKeycloak: vi.fn(() => ({ token: 'mock-token', tokenParsed: { sub: 'user-123' } })),
  resetKeycloak: vi.fn(),
}))
