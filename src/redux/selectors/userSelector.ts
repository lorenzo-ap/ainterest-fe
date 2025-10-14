import { RootState } from '../store';

export const selectLoggedUser = (state: RootState) => state.user.user;
export const selectAuthLoading = (state: RootState) => state.user.isAuthLoading;
