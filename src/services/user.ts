import { getCurrentUser, updateUser } from '../api';
import { setUser } from '../redux/slices';
import { store } from '../redux/store';
import { User } from '../types';

export const userService = {
  setCurrentUser: async () => {
    getCurrentUser().then((response) => {
      store.dispatch(setUser(response.data));
    });
  },

  editUser: async (data: User) =>
    updateUser(data).then((response) => {
      store.dispatch(setUser(response.data));
    })
};
