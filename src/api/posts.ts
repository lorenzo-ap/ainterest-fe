import { apis } from '../assets/apis/apis';
import type { CommentModel, PostGeneratedImage, PostModel } from '../types';
import { req } from './axios';

export const getPosts = async () => {
	const res = await req.get<PostModel[]>(`v1/${apis.posts}`);
	return res.data;
};

export const createPost = async (image: PostGeneratedImage) => {
	const res = await req.post<PostModel>(`v1/${apis.posts}`, image);
	return res.data;
};

export const likePost = async (postId: string) => {
	const res = await req.put<PostModel>(`v1/${apis.posts}/${postId}`);
	return res.data;
};

export const deletePost = async (postId: string) => {
	const res = await req.delete(`v1/${apis.posts}/${postId}`);
	return res.data;
};

export const getUserPosts = async (userId: string) => {
	const res = await req.get<PostModel[]>(`v1/${apis.posts}/${userId}`);
	return res.data;
};

export const getComments = async (postId: string) => {
	const res = await req.get<CommentModel[]>(`v1/${apis.posts}/${postId}/comments`);
	return res.data;
};

export const createComment = async (postId: string, text: string) => {
	const res = await req.post<CommentModel>(`v1/${apis.posts}/${postId}/comments`, { text });
	return res.data;
};
