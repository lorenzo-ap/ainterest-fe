import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types/post.interface';

const initialState: Post[] = [];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (_, action: PayloadAction<Post[]>) => {
      return action.payload;
    },

    addPost: (state, action: PayloadAction<Post>) => {
      state.unshift(action.payload);
    }
  }
});

export const { setPosts, addPost } = postsSlice.actions;
export default postsSlice.reducer;
