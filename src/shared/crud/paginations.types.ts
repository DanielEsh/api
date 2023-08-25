interface PaginationLinks {
  previous: number | null;
  next: number | null;
}

interface Pagination {
  itemsCountOnPage: number;
  itemsPerPage: number;
  totalPages: number;
  page: number;
  links: PaginationLinks;
}

export interface Meta {
  totalItemsCount: number;
  pagination: Pagination;
}

export interface PageableResponse<ENTITY> {
  content: ENTITY[];
  meta: Meta;
}

export interface PaginationsParams {
  sort: [string];
  order: ['asc' | 'desc'];
  limit: number;
  page: number;
}
