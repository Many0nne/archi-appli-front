import { apiCall } from './useApi'
import type { AdminStats } from '../types/admin'
import type { Spectacle } from '../types/spectacle'

export async function getStats(): Promise<AdminStats> {
  return apiCall<AdminStats>('/admin/stats')
}

export async function createSpectacle(s: Spectacle): Promise<Spectacle> {
  return apiCall<Spectacle>('/spectacles', { method: 'POST', body: s })
}

export async function updateSpectacle(id: number, s: Spectacle): Promise<Spectacle> {
  return apiCall<Spectacle>(`/spectacles/${id}`, { method: 'PUT', body: s })
}

export async function deleteSpectacle(id: number): Promise<void> {
  return apiCall<void>(`/spectacles/${id}`, { method: 'DELETE' })
}
