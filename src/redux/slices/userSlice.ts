import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

export interface UserState {
  user: User | null;
  isAuthLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthLoading: true
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isAuthLoading = action.payload;
    }
  }
});

export const { setUser, setAuthLoading } = userSlice.actions;
export const userReducer = userSlice.reducer;
