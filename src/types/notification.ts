export enum NotificationType {
  Like = 'like'
}

export interface Notification {
  _id: string;
  userId: string;
  actorId: string;
  actorUsername: string;
  actorPhoto: string;
  type: NotificationType;
  postId: string;
  postPhoto: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsUnreadCount {
  count: number;
}
