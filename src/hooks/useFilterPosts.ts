import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterCriteria, FiltersState, Post, SelectorType } from '../types';

export const useFilterPosts = (
  postsSelector: SelectorType<Post[]>,
  setFilteredPosts: ActionCreatorWithPayload<Post[]>,
  filtersStateSelector: SelectorType<FiltersState>,
  setFiltersState: ActionCreatorWithPayload<FiltersState>,
  resetFilters: ActionCreatorWithoutPayload
) => {
  const dispatch = useDispatch();
  const posts = useSelector(postsSelector);
  const { criteria: activeFiltersCriteria, isAscending } = useSelector(filtersStateSelector);

  const filterPosts = (criteria: FilterCriteria, ascending: boolean) => {
    const filteredPosts = [...posts].sort((a, b) => {
      let comparison = 0;

      switch (criteria) {
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

      return ascending ? comparison : -comparison;
    });

    dispatch(setFilteredPosts(filteredPosts));
  };

  const handleFiltersChange = (criteria: FilterCriteria) => {
    const newIsAscending = activeFiltersCriteria === criteria ? !isAscending : true;
    dispatch(setFiltersState({ criteria, isAscending: newIsAscending }));
    filterPosts(criteria, newIsAscending);
  };

  const resetFilteredPosts = () => {
    dispatch(resetFilters());
  };

  useEffect(() => {
    filterPosts(activeFiltersCriteria, isAscending);

    return () => {
      dispatch(resetFilters());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    activeFiltersCriteria,
    isAscending,
    handleFiltersChange,
    resetFilteredPosts
  };
};
