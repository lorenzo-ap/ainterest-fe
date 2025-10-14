import { apis } from '../assets/apis/apis';
import { AccessToken, SignInForm, SignUpForm, User } from '../types';
import { authReq, req } from './axios';

export const signIn = (values: SignInForm) => req.post<User>(`v1/${apis.auth}/login`, values);
export const signUp = (values: SignUpForm) => req.post<User>(`v1/${apis.auth}/register`, values);
export const signOut = () => authReq.post(`v1/${apis.auth}/logout`);
export const refreshToken = () => req.post<AccessToken>(`v1/${apis.auth}/refresh`);
