import { RootState } from '../store';

export const selectLoggedUser = (state: RootState) => state.user;
