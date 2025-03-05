import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectSearchText = (state: RootState) => state.posts.searchText;

export const selectSearchedPosts = createSelector([selectPosts, selectSearchText], (allPosts, searchText) => {
  if (!searchText.trim()) return allPosts;

  return allPosts.filter(
    (post) =>
      post.prompt.toLowerCase().includes(searchText.trim().toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchText.trim().toLowerCase())
  );
});

export const selectPostsFilters = (state: RootState) => state.posts.filters;
