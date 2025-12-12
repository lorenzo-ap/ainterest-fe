import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiltersState, Post, SortCriteria, SortOrder } from '../types';
import { useDebounce } from './useDebounce';

const DEFAULT_FILTERS: FiltersState = {
  criteria: SortCriteria.DATE,
  order: SortOrder.ASCENDING
};

interface UsePostsFilteringOptions {
  searchByUsername?: boolean;
}

export const usePostsFiltering = (posts: Post[], options: UsePostsFilteringOptions = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { searchByUsername = false } = options;

  const initialSearch = searchParams.get('search');
  const initialSortBy = searchParams.get('sortBy') as SortCriteria;
  const initialOrder = searchParams.get('order') as SortOrder;

  const [searchText, setSearchText] = useState(initialSearch ?? '');
  const [filters, setFilters] = useState<FiltersState>({
    criteria: initialSortBy || DEFAULT_FILTERS.criteria,
    order: initialOrder || DEFAULT_FILTERS.order
  });

  const debouncedSearch = useDebounce(searchText);

  useEffect(() => {
    setSearchParams((prevParams) => {
      if (debouncedSearch) {
        prevParams.set('search', debouncedSearch);
      } else {
        prevParams.delete('search');
      }
      return prevParams;
    });
  }, [debouncedSearch, setSearchParams]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
  };

  const resetSearch = () => {
    setSearchText('');
  };

  const handleFiltersChange = (criteria: SortCriteria) => {
    const order =
      filters.criteria === criteria
        ? filters.order === SortOrder.ASCENDING
          ? SortOrder.DESCENDING
          : SortOrder.ASCENDING
        : SortOrder.ASCENDING;

    setFilters({
      criteria,
      order
    });

    setSearchParams((prevParams) => {
      prevParams.set('sortBy', criteria);
      prevParams.set('order', order);

      return prevParams;
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);

    setSearchParams((prevParams) => {
      prevParams.delete('sortBy');
      prevParams.delete('order');

      return prevParams;
    });
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let result = [...posts];

    if (debouncedSearch) {
      const lowerSearchText = debouncedSearch.toLowerCase();
      result = result.filter((post) => {
        const matchesPrompt = post.prompt.toLowerCase().includes(lowerSearchText);
        const matchesUsername = searchByUsername && post.user.username.toLowerCase().includes(lowerSearchText);
        return matchesPrompt || matchesUsername;
      });
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.criteria) {
        case SortCriteria.DATE:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case SortCriteria.NAME:
          comparison = a.prompt.localeCompare(b.prompt);
          break;
        case SortCriteria.LIKES:
          comparison = b.likes.length - a.likes.length;
          break;
      }

      return filters.order === SortOrder.ASCENDING ? comparison : -comparison;
    });

    return result;
  }, [posts, debouncedSearch, filters, searchByUsername]);

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
