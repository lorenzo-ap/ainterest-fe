import { apis } from '../assets/apis/apis';
import { AccessToken, SignInForm, SignUpForm, User } from '../types';
import { req } from './axios';

export const signIn = (values: SignInForm) => req.post<User>(`v1/${apis.auth}/login`, values);
export const signUp = (values: SignUpForm) => req.post<User>(`v1/${apis.auth}/register`, values);
export const googleSignIn = (credential: string) => req.post<User>(`v1/${apis.auth}/google`, { credential });
export const signOut = () => req.post(`v1/${apis.auth}/logout`);
export const refreshToken = () => req.post<AccessToken>(`v1/${apis.auth}/refresh`);
