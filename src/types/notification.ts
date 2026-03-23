export const NotificationType = {
	Like: 'LIKE'
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface Notification {
	id: string;
	userId: string;
	type: NotificationType;
	read: boolean;
	actor: NotificationActor;
	post: NotificationPost;
	createdAt: string;
}

export interface NotificationActor {
	id: string;
	username: string;
	photo: string;
}

export interface NotificationPost {
	id: string;
	photo: string;
}

export interface NotificationsUnreadCountResponse {
	count: number;
}

export interface MarkAllNotificationsAsReadResponse {
	modifiedCount: number;
}

export interface DeleteAllNotificationsResponse {
	deletedCount: number;
}
