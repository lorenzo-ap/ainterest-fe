export interface User {
  _id: string;
  username: string;
  email: string;
  photo: string;
  role: UserRole;
  token: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
