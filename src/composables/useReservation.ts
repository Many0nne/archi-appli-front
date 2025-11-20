import type { Spectacle } from '../types/spectacle'
import { apiCall } from './useApi'

export async function getReservations(): Promise<Spectacle[]> {
  return apiCall<Spectacle[]>('/reservations')
}

export async function getReservationsForUser(userId: number | string): Promise<Spectacle[]> {
  const q = encodeURIComponent(String(userId))
  return apiCall<Spectacle[]>(`/reservations?userId=${q}`)
}

export async function createReservation(spectacleId: number, userId: number | string, quantity: number = 1): Promise<Spectacle> {
  return apiCall<Spectacle>('/reservations', { method: 'POST', body: { spectacleId, userId, quantity } })
}

export async function getReservation(id: number): Promise<Spectacle> {
  return apiCall<Spectacle>(`/reservations/${id}`)
}

export async function deleteReservation(id: number): Promise<void> {
  return apiCall<void>(`/reservations/${id}`, { method: 'DELETE' })
}

