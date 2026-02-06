import type { Notification } from './notification';

export type SSEMessageType = 'notification' | 'heartbeat';

export interface SSEMessage {
	type: SSEMessageType;
	payload?: Notification;
}

export type MessageHandler = (message: SSEMessage) => void;
export type ErrorHandler = (error: Error) => void;
