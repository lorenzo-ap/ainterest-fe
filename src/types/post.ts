import { User } from './user';

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

export interface UpdatePost {
  postId: string;
  userId: string;
}

export enum SortCriteria {
  Date = 'Date',
  Name = 'Name',
  Likes = 'Likes'
}
