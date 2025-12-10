import { ChangeEvent, useMemo, useState } from 'react';
import { FilterCriteria, FiltersState, Post } from '../types';

const DEFAULT_FILTERS: FiltersState = {
  criteria: FilterCriteria.Date,
  isAscending: true
};

interface UsePostsFilteringOptions {
  searchByUsername?: boolean;
}

export const usePostsFiltering = (posts: Post[] | undefined, options: UsePostsFilteringOptions = {}) => {
  const { searchByUsername = false } = options;

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const resetSearch = () => {
    setSearchText('');
  };

  const handleFiltersChange = (criteria: FilterCriteria) => {
    setFilters((prev) => ({
      criteria,
      isAscending: prev.criteria === criteria ? !prev.isAscending : true
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let result = [...posts];

    // Apply search filter
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter((post) => {
        const matchesPrompt = post.prompt.toLowerCase().includes(lowerSearchText);
        const matchesUsername = searchByUsername && post.user.username.toLowerCase().includes(lowerSearchText);
        return matchesPrompt || matchesUsername;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.criteria) {
        case FilterCriteria.Date:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case FilterCriteria.Name:
          comparison = a.prompt.localeCompare(b.prompt);
          break;
        case FilterCriteria.Likes:
          comparison = b.likes.length - a.likes.length;
          break;
      }

      return filters.isAscending ? comparison : -comparison;
    });

    return result;
  }, [posts, searchText, filters, searchByUsername]);

  return {
    searchText,
    handleSearchChange,
    resetSearch,
    filters,
    handleFiltersChange,
    resetFilters,
    filteredPosts
  };
};
