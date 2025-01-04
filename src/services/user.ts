import api from '../api/axios';
import { setUser } from '../redux/slices/userSlice';
import { store } from '../redux/store';

export const userService = {
  setCurrentUser: async () => {
    return api.get('users/current').then((response) => {
      store.dispatch(setUser(response.data));
    });
  }
};
