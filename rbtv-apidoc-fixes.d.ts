import {genericApiResponse} from './rbtv-apidoc/shared';

export interface pagination {
  offset: number;
  limit: number;
  total: number;
}

export interface genericPaginatedApiResponse<T> extends genericApiResponse<T> {
  pagination: pagination;
}
