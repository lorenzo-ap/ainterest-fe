import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
