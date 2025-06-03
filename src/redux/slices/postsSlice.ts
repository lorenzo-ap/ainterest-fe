import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterCriteria, FiltersState, Post, UpdatePost } from '../../types';

export interface PostsState {
  posts: Post[];
  originalPosts: Post[];
  searchText: string;
  filters: FiltersState;
}

const initialState: PostsState = {
  posts: [],
  originalPosts: [],
  searchText: '',
  filters: {
    criteria: FilterCriteria.Date,
    isAscending: true
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts = [action.payload, ...state.posts];
      state.originalPosts = [...state.posts];
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      if (!state.originalPosts.length) {
        state.originalPosts = [...action.payload];
      }
    },
    updatePostLike: (state, action: PayloadAction<UpdatePost>) => {
      if (!state.posts.length) return;

      const { postId, userId } = action.payload;

      const postIndex = state.posts.findIndex((post) => post._id === postId);
      const likes = state.posts[postIndex].likes;
      const newLikes = likes.includes(userId) ? likes.filter((like) => like !== userId) : [...likes, userId];

      state.posts[postIndex] = {
        ...state.posts[postIndex],
        likes: newLikes
      };
      state.originalPosts = [...state.posts];
    },
    removePost: (state, action: PayloadAction<string>) => {
      if (!state.posts.length) return;

      state.posts = state.posts.filter((post) => post._id !== action.payload);
      state.originalPosts = [...state.posts];
    },

    setPostsSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    resetPostsSearch: (state) => {
      state.searchText = '';
    },

    setPostsFilters: (state, action: PayloadAction<FiltersState>) => {
      state.filters = action.payload;
    },
    resetPostsFilters: (state) => {
      state.filters = initialState.filters;
      state.posts = [...state.originalPosts];
    }
  }
});

export const {
  addPost,
  setPosts,
  updatePostLike,
  removePost,

  setPostsSearchText,
  resetPostsSearch,

  setPostsFilters,
  resetPostsFilters
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
