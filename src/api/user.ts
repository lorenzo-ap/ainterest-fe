import { apis } from '../assets/apis/apis';
import { User } from '../types';
import req from './axios';

export const getCurrentUser = () => req.get<User>(`v1/${apis.user}/current`);
export const updateUser = (user: User) => req.put<User>(`v1/${apis.user}/edit`, user);

export const getUserByUsername = (username: string) => req.get<User>(`v1/${apis.user}/${username}`);
