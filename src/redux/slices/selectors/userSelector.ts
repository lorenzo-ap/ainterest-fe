import { RootState } from '../slices';

export const selectLoggedUser = (state: RootState) => state.user;
