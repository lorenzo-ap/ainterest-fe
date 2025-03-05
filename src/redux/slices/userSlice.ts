import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

const initialState = null as User | null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<User | null>) => {
      return action.payload;
    }
  }
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
