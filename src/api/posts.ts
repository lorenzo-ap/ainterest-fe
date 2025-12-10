import { apis } from '../assets/apis/apis';
import { Post, PostGeneratedImage } from '../types';
import { req } from './axios';

export const getPosts = () => req.get<Post[]>(`v1/${apis.posts}`);
export const createPost = (image: PostGeneratedImage) => req.post<Post>(`v1/${apis.posts}`, image);
export const likePost = (postId: string) => req.put<Post>(`v1/${apis.posts}/${postId}`);
export const deletePost = (postId: string) => req.delete(`v1/${apis.posts}/${postId}`);

export const getUserPosts = (userId: string) => req.get<Post[]>(`v1/${apis.posts}/${userId}`);
