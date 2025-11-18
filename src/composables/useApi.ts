import type { ApiOptions } from '../types';

const API_URL = import.meta.env.VITE_API_BASE;

export async function apiCall<Response, Body = unknown>(
  url: string,
  options: ApiOptions<Body> = {}
): Promise<Response> {
  const { method = 'GET', body, headers = {} } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': body ? 'application/json' : undefined,
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  };

  const res = await fetch(`${API_URL}${url}`, fetchOptions);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<Response>;
}
