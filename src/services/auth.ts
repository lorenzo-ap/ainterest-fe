import { refreshToken, signIn, signOut, signUp } from '../api';
import { setUser } from '../redux/slices';
import { store } from '../redux/store';
import { SignInForm, SignUpForm, User } from '../types';
import { removeAccessToken, setAccessToken } from '../utils';

const authUser = (user: User) => {
  store.dispatch(setUser(user));
  setAccessToken(user.accessToken);
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
    removeAccessToken();
    store.dispatch(setUser(null));
  },

  refreshToken: async () => {
    const res = await refreshToken();
    setAccessToken(res.data.accessToken);
  }
};
