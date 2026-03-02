import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apis } from '../assets/apis/apis';
import { notificationKeys, useCurrentUser } from '../queries';
import { sseService, toastService } from '../services';
import type { Notification } from '../types';

const url = `${apis.root}/v1/${apis.notifications}/stream`;

export const useNotificationListener = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { data: currentUser } = useCurrentUser();
	const currentUserId = currentUser?.id;

	useEffect(() => {
		if (!currentUserId) return;

		sseService.connect(url);

		return () => {
			sseService.disconnect();
		};
	}, [currentUserId]);

	const handleNewNotification = useCallback(
		(notification: Notification) => {
			queryClient.setQueryData<Notification[]>(notificationKeys.notifications, (old) =>
				old ? [notification, ...old] : old
			);
			queryClient.setQueryData<number>(notificationKeys.notificationsUnreadCount, (old) => (old ?? 0) + 1);

			toastService.success(
				`${notification.actorUsername} ${t('pages.components.notifications.liked_your_post')}`,
				3000
			);
		},
		[queryClient, t]
	);

	useEffect(() => {
		if (!currentUserId) return;

		return sseService.onMessage((message) => {
			if (!message.payload) return;

			switch (message.type) {
				case 'notification':
					handleNewNotification(message.payload);
					break;
				default:
					break;
			}
		});
	}, [currentUserId, handleNewNotification]);
};
