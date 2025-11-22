type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions<Body = unknown> {
  method?: HttpMethod;
  body?: Body;
  headers?: Record<string, string>;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Reservation {
  id: number;
  reservationDate: string;
  quantity: number;
  totalPrice: number;
  spectacle?: {
    id: number;
    title: string;
    date: string;
    price: number;
    imageUrl: string;
  };
}