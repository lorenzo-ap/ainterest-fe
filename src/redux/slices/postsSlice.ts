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

    likePost: (state, action: PayloadAction<{ postId: string; userId: string }>) => {
      const { postId, userId } = action.payload;

      const index = state.allPosts.findIndex((post) => post._id === postId);
      if (index === -1) return;

      const likes = state.allPosts[index].likes;
      const newLikes = likes.includes(userId) ? likes.filter((like) => like !== userId) : [...likes, userId];

      state.allPosts[index] = {
        ...state.allPosts[index],
        likes: newLikes
      };
    },

    setUserPosts: (state, action: PayloadAction<UserPosts>) => {
      state.userPosts = action.payload;
    },

    updateUserPost: (state, action: PayloadAction<Post>) => {
      const index = state.userPosts.posts.findIndex((post) => post._id === action.payload._id);

      if (index === -1) return;
      state.userPosts.posts[index] = action.payload;
    },

    likeUserPost: (state, action: PayloadAction<{ postId: string; userId: string }>) => {
      const { postId, userId } = action.payload;

      const index = state.userPosts.posts.findIndex((post) => post._id === postId);
      if (index === -1) return;

      const likes = state.userPosts.posts[index].likes;
      const newLikes = likes.includes(userId) ? likes.filter((like) => like !== userId) : [...likes, userId];

      state.userPosts.posts[index] = {
        ...state.userPosts.posts[index],
        likes: newLikes
      };
    }
  }
});

export const { setPosts, addPost, likePost, likeUserPost, updatePost, setUserPosts, updateUserPost } =
  postsSlice.actions;
export default postsSlice.reducer;
