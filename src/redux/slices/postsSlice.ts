import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, UpdatePost } from '../../types';

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
      state.allPosts.unshift(action.payload);
      state.userPosts.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.allPosts.findIndex((post) => post._id === action.payload._id);
      state.allPosts[index] = action.payload;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.allPosts = state.allPosts.filter((post) => post._id !== action.payload);
      state.userPosts.posts = state.userPosts.posts.filter((post) => post._id !== action.payload);
    },

    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.userPosts.posts = action.payload;
    },
    updateUserPost: (state, action: PayloadAction<Post>) => {
      const index = state.userPosts.posts.findIndex((post) => post._id === action.payload._id);
      state.userPosts.posts[index] = action.payload;
    },

    updatePostLike: (state, action: PayloadAction<UpdatePost>) => {
      const { postId, userId } = action.payload;

      const allPostsPostIndex = state.allPosts.findIndex((post) => post._id === postId);
      const userPostsPostIndex = state.userPosts.posts.findIndex((post) => post._id === postId);

      const likes = state.allPosts[allPostsPostIndex].likes;
      const newLikes = likes.includes(userId) ? likes.filter((like) => like !== userId) : [...likes, userId];

      state.allPosts[allPostsPostIndex] = {
        ...state.allPosts[allPostsPostIndex],
        likes: newLikes
      };
      state.userPosts.posts[userPostsPostIndex] = {
        ...state.userPosts.posts[userPostsPostIndex],
        likes: newLikes
      };
    }
  }
});

export const { setPosts, addPost, updatePostLike, deletePost, updatePost, setUserPosts, updateUserPost } =
  postsSlice.actions;
export default postsSlice.reducer;
