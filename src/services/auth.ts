import { signIn, signUp } from '../api';
import { setUser } from '../redux/slices';
import { store } from '../redux/store';
import { SignInForm, SignUpForm, User } from '../types';

const authUser = (user: User) => {
  store.dispatch(setUser(user));
  localStorage.setItem('jwt-token', user.token);
};

export const authService = {
  signIn: (values: SignInForm) =>
    signIn(values).then((res) => {
      authUser(res.data);
    }),

  signUp: async (values: SignUpForm) =>
    signUp(values).then((res) => {
      authUser(res.data);
    })
};
