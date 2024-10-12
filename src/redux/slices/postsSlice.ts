import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Post } from '../../types/post.interface';

export interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: []
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    }
  }
});

export const { setPosts, addPost } = postsSlice.actions;
export default postsSlice.reducer;
