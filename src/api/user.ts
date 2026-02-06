import { apis } from '../assets/apis/apis';
import type { UserModel } from '../types';
import { req } from './axios';

export const getCurrentUser = async () => {
	const res = await req.get<UserModel>(`v1/${apis.user}/current`);
	return res.data;
};

export const updateCurrentUser = async (user: UserModel) => {
	const res = await req.put<UserModel>(`v1/${apis.user}/edit`, user);
	return res.data;
};

export const getUserByUsername = async (username: string) => {
	const res = await req.get<UserModel>(`v1/${apis.user}/${username}`);
	return res.data;
};
