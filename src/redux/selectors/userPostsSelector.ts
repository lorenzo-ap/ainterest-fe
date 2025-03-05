import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectUserPosts = (state: RootState) => state.userPosts.posts;
export const selectUserPostsSearchText = (state: RootState) => state.userPosts.searchText;

export const selectSearchedUserPosts = createSelector(
  [selectUserPosts, selectUserPostsSearchText],
  (userPosts, userSearchText) => {
    if (!userSearchText.trim()) return userPosts;

    return userPosts.filter((post) => post.prompt.toLowerCase().includes(userSearchText.trim().toLowerCase()));
  }
);

export const selectUserPostsFilters = (state: RootState) => state.userPosts.filters;
