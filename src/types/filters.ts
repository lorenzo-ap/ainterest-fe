export enum FilterCriteria {
  Date = 'Date',
  Name = 'Name',
  Likes = 'Likes'
}

export interface FiltersState {
  criteria: FilterCriteria;
  isAscending: boolean;
}
