import type { Spectacle } from '../types/spectacle'
import type { PageableResponse } from '../types/api'
import { apiCall } from './useApi'

export async function getSpectacles(): Promise<Spectacle[]> {
  const response = await apiCall<PageableResponse<Spectacle>>('/spectacles')
  return response.content
}

export async function getSpectacle(id: number): Promise<Spectacle> {
  return apiCall<Spectacle>(`/spectacles/${id}`)
}