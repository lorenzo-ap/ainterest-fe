import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectorType } from '../types';

export const useSearchPosts = <T>(
  searchTextSelector: SelectorType<string>,
  searchedPostsSelector: SelectorType<T[]>,
  setSearchText: ActionCreatorWithPayload<string>,
  resetSearch: ActionCreatorWithoutPayload<string>
) => {
  const dispatch = useDispatch();
  const searchText = useSelector(searchTextSelector);
  const searchedPosts = useSelector(searchedPostsSelector);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(e.target.value));
  };

  const resetSearchedPosts = () => {
    dispatch(resetSearch());
  };

  useEffect(() => {
    return () => {
      dispatch(resetSearch());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    searchText,
    searchedPosts,
    handleSearchChange,
    resetSearchedPosts
  };
};
