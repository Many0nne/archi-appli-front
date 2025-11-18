type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions<Body = unknown> {
  method?: HttpMethod;
  body?: Body;
  headers?: Record<string, string>;
}