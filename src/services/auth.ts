import { signIn, signOut, signUp } from '../api';
import { setUser } from '../redux/slices';
import { store } from '../redux/store';
import { SignInForm, SignUpForm, User } from '../types';

const authUser = (user: User) => {
  store.dispatch(setUser(user));
};

export const authService = {
  signIn: async (values: SignInForm) => {
    const res = await signIn(values);
    authUser(res.data);
  },

  signUp: async (values: SignUpForm) => {
    const res = await signUp(values);
    authUser(res.data);
  },

  signOut: async () => {
    await signOut();
    store.dispatch(setUser(null));
  }
};
