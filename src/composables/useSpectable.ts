import type { Spectacle } from '../types/spectacle'
import { apiCall } from './useApi'

export async function getSpectacles(): Promise<Spectacle[]> {
  return apiCall<Spectacle[]>('/spectacles')
}
