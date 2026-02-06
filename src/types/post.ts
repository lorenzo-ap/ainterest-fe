import type { UserModel } from './user';

export interface PostModel {
	_id: string;
	prompt: string;
	photo: string;
	createdAt: string;
	user: UserModel;
	likes: string[];
}

export interface UpdatePost {
	postId: string;
	userId: string;
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
