import api from '../api/axios';
import { SignInForm } from '../components/Header/components/SignInModal';
import { SignUpForm } from '../components/Header/components/SignUpModal';
import { setUser } from '../redux/slices/userSlice';
import { store } from '../redux/store';
import { User } from '../types/user.interface';

const authUser = (user: User) => {
  store.dispatch(setUser(user));
  localStorage.setItem('jwt-token', user.token);
};

export const authService = {
  signIn: async (values: SignInForm) => {
    return api.post<User>('users/login', values).then((res) => {
      authUser(res.data);
    });
  },

  signUp: async (values: SignUpForm) => {
    return api.post<User>('users', values).then((res) => {
      authUser(res.data);
    });
  }
};
