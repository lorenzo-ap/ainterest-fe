export enum SortCriteria {
  DATE = 'date',
  NAME = 'name',
  LIKES = 'likes'
}

export enum SortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc'
}

export interface FiltersState {
  criteria: SortCriteria;
  order: SortOrder;
}
