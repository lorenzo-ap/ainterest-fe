import type { PostUserModel } from './post';

export interface CommentModel {
	id: string;
	text: string;
	author: PostUserModel;
	post: string;
	createdAt: string;
}
