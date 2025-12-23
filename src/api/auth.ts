import { apis } from '../assets/apis/apis';
import { AccessToken, SignInForm, SignUpForm, User } from '../types';
import { req } from './axios';

export const signIn = async (values: SignInForm) => {
  const res = await req.post<User>(`v1/${apis.auth}/login`, values);
  return res.data;
};

export const signUp = async (values: SignUpForm) => {
  const res = await req.post<User>(`v1/${apis.auth}/register`, values);
  return res.data;
};

export const googleSignIn = async (credential: string) => {
  const res = await req.post<User>(`v1/${apis.auth}/google`, { credential });
  return res.data;
};

export const signOut = () => req.post(`v1/${apis.auth}/logout`);

export const refreshToken = async () => {
  const res = await req.post<AccessToken>(`v1/${apis.auth}/refresh`);
  return res.data;
};
