import { User } from './user.interface';

export interface Post {
  _id: string;
  prompt: string;
  photo: string;
  createdAt: string;
  user: User;
  likes: (string | undefined)[];
}

export interface GeneratedImage {
  prompt: string;
  photo: string;
}
