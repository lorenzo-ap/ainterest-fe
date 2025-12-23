import { apis } from '../assets/apis/apis';
import { User } from '../types';
import { req } from './axios';

export const getCurrentUser = async () => {
  const res = await req.get<User>(`v1/${apis.user}/current`);
  return res.data;
};

export const updateCurrentUser = async (user: User) => {
  const res = await req.put<User>(`v1/${apis.user}/edit`, user);
  return res.data;
};

export const getUserByUsername = async (username: string) => {
  const res = await req.get<User>(`v1/${apis.user}/${username}`);
  return res.data;
};
