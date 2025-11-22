import type { Reservation, PageableResponse } from '../types/api'
import { apiCall } from './useApi'

export async function getReservations(): Promise<Reservation[]> {
  const response = await apiCall<PageableResponse<Reservation>>('/reservations')
  return response.content
}

export async function getReservationsForUser(userId: number | string): Promise<Reservation[]> {
  const q = encodeURIComponent(String(userId))
  const response = await apiCall<PageableResponse<Reservation>>(`/reservations?userId=${q}`)
  return response.content
}

export async function createReservation(spectacleId: number, userId: number | string, quantity: number = 1): Promise<Reservation> {
  return apiCall<Reservation>('/reservations', { method: 'POST', body: { spectacleId, userId, quantity } })
}

export async function getReservation(id: number): Promise<Reservation> {
  return apiCall<Reservation>(`/reservations/${id}`)
}

export async function deleteReservation(id: number): Promise<void> {
  return apiCall<void>(`/reservations/${id}`, { method: 'DELETE' })
}

