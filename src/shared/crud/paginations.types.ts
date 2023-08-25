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

export interface PagiableResponse<ENTITY> {
  content: ENTITY[];
  meta: Meta;
}
