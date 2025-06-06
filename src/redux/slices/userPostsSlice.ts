import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterCriteria, FiltersState, Post, UpdatePost } from '../../types';

export interface UserPostsState {
  posts: Post[];
  originalPosts: Post[];
  searchText: string;
  filters: FiltersState;
}

const initialState: UserPostsState = {
  posts: [],
  originalPosts: [],
  searchText: '',
  filters: {
    criteria: FilterCriteria.Date,
    isAscending: true
  }
};

const userPostsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addUserPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      if (!state.originalPosts.length) {
        state.originalPosts = [...action.payload];
      }
    },
    updateUserPostLike: (state, action: PayloadAction<UpdatePost>) => {
      if (!state.posts.length) return;

      const { postId, userId } = action.payload;

      const postIndex = state.posts.findIndex((post) => post._id === postId);
      if (!state.posts[postIndex]) return;

      const likes = state.posts[postIndex].likes;
      const newLikes = likes.includes(userId) ? likes.filter((like) => like !== userId) : [...likes, userId];

      state.posts[postIndex] = {
        ...state.posts[postIndex],
        likes: newLikes
      };
      state.originalPosts = [...state.posts];
    },
    removeUserPost: (state, action: PayloadAction<string>) => {
      if (!state.posts.length) return;

      state.posts = state.posts.filter((post) => post._id !== action.payload);
      state.originalPosts = [...state.posts];
    },

    setUserPostsSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    resetUserPostsSearch: (state) => {
      state.searchText = '';
    },

    setUserPostsFilters: (state, action: PayloadAction<FiltersState>) => {
      state.filters = action.payload;
    },
    resetUserPostsFilters: (state) => {
      state.filters = initialState.filters;
      state.posts = [...state.originalPosts];
    }
  }
});

export const {
  addUserPost,
  setUserPosts,
  updateUserPostLike,
  removeUserPost,

  setUserPostsSearchText,
  resetUserPostsSearch,

  setUserPostsFilters,
  resetUserPostsFilters
} = userPostsSlice.actions;
export const userPostsReducer = userPostsSlice.reducer;
