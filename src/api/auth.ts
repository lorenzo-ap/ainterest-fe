import { apis } from '../assets/apis/apis';
import type { AccessToken, PasswordResponse, ResetPasswordForm, SignInForm, SignUpForm, UserModel } from '../types';
import { req } from './axios';

export const signIn = async (body: SignInForm) => {
	const res = await req.post<UserModel>(`v1/${apis.auth}/login`, body);
	return res.data;
};

export const signUp = async (body: SignUpForm) => {
	const res = await req.post<UserModel>(`v1/${apis.auth}/register`, body);
	return res.data;
};

export const googleSignIn = async (credential: string) => {
	const res = await req.post<UserModel>(`v1/${apis.auth}/google`, { credential });
	return res.data;
};

export const signOut = () => req.post(`v1/${apis.auth}/logout`);

export const refreshToken = async () => {
	const res = await req.post<AccessToken>(`v1/${apis.auth}/refresh`);
	return res.data;
};

export const forgotPassword = async (email: string) => {
	const res = await req.post<PasswordResponse>(`v1/${apis.auth}/forgot-password`, { email });
	return res.data;
};

export const resetPassword = async (body: ResetPasswordForm) => {
	const res = await req.post<PasswordResponse>(`v1/${apis.auth}/reset-password`, body);
	return res.data;
};
