import { apis } from '../assets/apis/apis';
import { GeneratedImage, Post } from '../types';
import req from './axios';

export const createPost = (image: GeneratedImage) => req.post<Post>(`v1/${apis.posts}`, image);
export const getPosts = () => req.get<Post[]>(`v1/${apis.posts}`);

export const getUserPosts = (userId: string) => req.get<Post[]>(`v1/${apis.posts}/${userId}`);
export const likePost = (postId: string) => req.put<Post>(`v1/${apis.posts}/${postId}`);
export const deletePost = (postId: string) => req.delete<Post>(`v1/${apis.posts}/${postId}`);

export const generateImage = (prompt: string, size: number) =>
  req.post<{ image: string }>(`v1/${apis.posts}/generate-image`, { prompt, size });
