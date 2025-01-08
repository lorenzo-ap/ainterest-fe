import api from '../api/axios';
import { setUser } from '../redux/slices/userSlice';
import { store } from '../redux/store';
import { User } from '../types/user.interface';

const slug = 'users';

export const userService = {
  setCurrentUser: async () => {
    return api.get(`${slug}/current`).then((response) => {
      store.dispatch(setUser(response.data));
    });
  },

  editUser: async (data: User) => {
    return api.put(`${slug}/edit`, data).then((response) => {
      store.dispatch(setUser(response.data));
    });
  }
};
