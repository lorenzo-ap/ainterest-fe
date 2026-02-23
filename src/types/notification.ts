export const NotificationType = {
	Like: 'LIKE'
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export interface Notification {
	id: string;
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

export interface NotificationsUnreadCountResponse {
	count: number;
}

export interface MarkAllNotificationsAsReadResponse {
	modifiedCount: number;
}

export interface DeleteAllNotificationsResponse {
	deletedCount: number;
}
