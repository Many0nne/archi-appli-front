import type { Spectacle } from '../types/spectacle'
import type { PageableResponse } from '../types/api'
import { apiCall } from './useApi'

export async function getSpectacles(search?: string): Promise<Spectacle[]> {
  const url = search ? `/spectacles?search=${encodeURIComponent(search)}` : '/spectacles'
  const response = await apiCall<PageableResponse<Spectacle>>(url)
  return response?.content ?? []
}

export async function getSpectacle(id: number): Promise<Spectacle> {
  return apiCall<Spectacle>(`/spectacles/${id}`)
}