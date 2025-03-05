import { configureStore } from '@reduxjs/toolkit';
import { postsReducer, userPostsReducer, userReducer } from './slices';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    userPosts: userPostsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
