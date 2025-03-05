import { getCurrentUser, updateUser } from '../api';
import { setUser } from '../redux/slices';
import { store } from '../redux/store';
import { User } from '../types';

export const userService = {
  setCurrentUser: async () => {
    const res = await getCurrentUser();
    store.dispatch(setUser(res.data));
  },

  editUser: async (user: User) => {
    const res = await updateUser(user);
    store.dispatch(setUser(res.data));
  }
};
