export const SortCriteria = {
	DATE: 'date',
	NAME: 'name',
	LIKES: 'likes'
} as const;
export type SortCriteria = (typeof SortCriteria)[keyof typeof SortCriteria];

export const SortOrder = {
	ASCENDING: 'asc',
	DESCENDING: 'desc'
} as const;
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export interface FiltersState {
	criteria: SortCriteria;
	order: SortOrder;
}
