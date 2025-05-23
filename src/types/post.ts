import { User } from './user';

export interface Post {
  _id: string;
  prompt: string;
  photo: string;
  createdAt: string;
  user: User;
  likes: string[];
}

export interface UpdatePost {
  postId: string;
  userId: string;
}

export interface CreatePostForm {
  prompt: string;
  size: string;
  generatedImage: GeneratedImage;
}

export interface GeneratedImage {
  prompt: string;
  photo: string;
}
