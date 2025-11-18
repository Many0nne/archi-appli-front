import type { Spectacle } from '../types/spectacle';
import { useAuth } from '../stores/useAuth';

const API_URL = import.meta.env.VITE_API_BASE + '/api';

export async function getSpectacles(): Promise<Spectacle[]> {
  const token = useAuth.getState().token;
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/spectacles`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch spectacles');
  }
  return response.json();
}
