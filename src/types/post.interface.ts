import { User } from './user.interface';

export interface Post {
  _id: string;
  prompt: string;
  photo: string;
  createdAt: string;
  user: User;
}

export interface GeneratedImage {
  prompt: string;
  photo: string;
}
