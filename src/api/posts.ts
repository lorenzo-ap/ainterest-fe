import { apis } from '../assets/apis/apis';
import { Post, PostGeneratedImage } from '../types';
import { authReq, req } from './axios';

export const createPost = (image: PostGeneratedImage) => authReq.post<Post>(`v1/${apis.posts}`, image);
export const getPosts = () => req.get<Post[]>(`v1/${apis.posts}`);

export const getUserPosts = (userId: string) => req.get<Post[]>(`v1/${apis.posts}/${userId}`);
export const likePost = (postId: string) => authReq.put<Post>(`v1/${apis.posts}/${postId}`);
export const deletePost = (postId: string) => authReq.delete<Post>(`v1/${apis.posts}/${postId}`);
