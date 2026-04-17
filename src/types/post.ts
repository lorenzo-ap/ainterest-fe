interface PostUserModel {
	id: string;
	username: string;
	email: string;
	photo?: string;
}

export interface PostModel {
	id: string;
	prompt: string;
	photo: string;
	createdAt: string;
	user: PostUserModel;
	likesCount: number;
	likedByCurrentUser: boolean;
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
