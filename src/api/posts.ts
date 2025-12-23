import { apis } from '../assets/apis/apis';
import { Post, PostGeneratedImage } from '../types';
import { req } from './axios';

export const getPosts = async () => {
  const res = await req.get<Post[]>(`v1/${apis.posts}`);
  return res.data;
};
export const createPost = async (image: PostGeneratedImage) => {
  const res = await req.post<Post>(`v1/${apis.posts}`, image);
  return res.data;
};

export const likePost = async (postId: string) => {
  const res = await req.put<Post>(`v1/${apis.posts}/${postId}`);
  return res.data;
};

export const deletePost = async (postId: string) => {
  const res = await req.delete(`v1/${apis.posts}/${postId}`);
  return res.data;
};

export const getUserPosts = async (userId: string) => {
  const res = await req.get<Post[]>(`v1/${apis.posts}/${userId}`);
  return res.data;
};
