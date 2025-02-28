import { apis } from '../assets/apis/apis';
import { SignInForm, SignUpForm, User } from '../types';
import req from './axios';

export const signIn = (values: SignInForm) => req.post<User>(`v1/${apis.auth}/login`, values);
export const signUp = (values: SignUpForm) => req.post<User>(`v1/${apis.auth}/register`, values);
