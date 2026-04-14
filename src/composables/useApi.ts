import type { ApiOptions } from '../types';
import { getKeycloak } from '../config/keycloak'

const API_URL = import.meta.env.VITE_API_BASE;

export async function apiCall<Response, Body = unknown>(
  url: string,
  options: ApiOptions<Body> = {}
): Promise<Response> {
  const { method = 'GET', body, headers = {} } = options;

  let authHeader: Record<string, string> = {}
  try {
    const kc = getKeycloak()
    if (kc && typeof kc.token === 'string' && kc.token.length > 0) {
      authHeader = { Authorization: `Bearer ${kc.token}` }
    }
  } catch (err) {
    console.warn('Keycloak unavailable, sending request without auth header', err)
  }

  const hdrs: Record<string, string> = {}
  if (body) hdrs['Content-Type'] = 'application/json'
  Object.assign(hdrs, authHeader, headers)

  const fetchOptions: RequestInit = {
    method,
    headers: hdrs,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(`${API_URL}${url}`, fetchOptions);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let errorMessage = `Erreur ${res.status}`;

    // Essayer de parser la réponse JSON d'erreur du backend
    try {
      const errorData = JSON.parse(text);

      // Si c'est une erreur de validation avec des détails par champ
      if (errorData.errors && typeof errorData.errors === 'object') {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        errorMessage = errorMessages || errorData.message || errorMessage;
      }
      // Si c'est une erreur simple avec juste un message
      else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Si le parsing JSON échoue, utiliser le texte brut s'il est significatif
      if (text && text.length > 0 && text.length < 200) {
        errorMessage = text;
      }
    }

    throw new Error(errorMessage);
  }

  const raw = await res.text(); 
  if (raw.length === 0) {
    return undefined as unknown as Response;
  }
  try {
    return JSON.parse(raw) as Response;
  } catch {
    return raw as unknown as Response;
  }
}