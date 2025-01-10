import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types/post.interface';

interface UserPosts {
  userId: string;
  posts: Post[];
}

interface PostState {
  allPosts: Post[];
  userPosts: UserPosts;
}

const initialState: PostState = {
  allPosts: [],
  userPosts: {
    userId: '',
    posts: []
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.allPosts = action.payload;
    },

    addPost: (state, action: PayloadAction<Post>) => {
      if (state.allPosts.length) state.allPosts.unshift(action.payload);
      if (state.userPosts.posts.length) state.userPosts.posts.unshift(action.payload);
    },

    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.allPosts.findIndex((post) => post._id === action.payload._id);

      if (index === -1) return;
      state.allPosts[index] = action.payload;
    },

    setUserPosts: (state, action: PayloadAction<UserPosts>) => {
      state.userPosts = action.payload;
    },

    updateUserPost: (state, action: PayloadAction<Post>) => {
      const index = state.userPosts.posts.findIndex((post) => post._id === action.payload._id);

      if (index === -1) return;
      state.userPosts.posts[index] = action.payload;
    }
  }
});

export const { setPosts, addPost, updatePost, setUserPosts, updateUserPost } = postsSlice.actions;
export default postsSlice.reducer;
