import type { UserModel } from './user';

export interface PostModel {
	id: string;
	prompt: string;
	photo: string;
	createdAt: string;
	user: UserModel;
	likes: string[];
}

export interface CreatePostForm {
	prompt: string;
	size: string;
	postGeneratedImage: PostGeneratedImage;
}

export interface PostGeneratedImage {
	prompt: string;
	photo: string;
}
