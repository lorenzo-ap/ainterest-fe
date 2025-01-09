import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types/post.interface';

interface PostState {
  allPosts: Post[];
  userPosts: Post[];
}

const initialState: PostState = {
  allPosts: [],
  userPosts: []
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.allPosts = action.payload;
    },

    addPost: (state, action: PayloadAction<Post>) => {
      state.allPosts.unshift(action.payload);
    },

    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.allPosts.findIndex((post) => post._id === action.payload._id);

      if (index === -1) return;
      state.allPosts[index] = action.payload;
    },

    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.userPosts = action.payload;
    },

    updateUserPost: (state, action: PayloadAction<Post>) => {
      const index = state.userPosts.findIndex((post) => post._id === action.payload._id);

      if (index === -1) return;
      state.userPosts[index] = action.payload;
    }
  }
});

export const { setPosts, addPost, updatePost, setUserPosts, updateUserPost } = postsSlice.actions;
export default postsSlice.reducer;
