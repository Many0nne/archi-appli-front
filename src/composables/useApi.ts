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
    throw new Error(`API error ${res.status}: ${text}`);
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