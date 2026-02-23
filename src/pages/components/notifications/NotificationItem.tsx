import { ActionIcon, Avatar, Box, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDeleteNotification, useMarkNotificationAsRead } from '../../../queries';
import type { Notification } from '../../../types';
import { getLocale } from '../../../utils';

type NotificationItemProps = {
	notification: Notification;
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
	const { t, i18n } = useTranslation();

	const { mutate: markAsRead, isPending: isMarkAsReadPending } = useMarkNotificationAsRead(notification.id);
	const { mutate: deleteNotification, isPending: isDeletePending } = useDeleteNotification(notification.id);

	const locale = getLocale(i18n.language);
	const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
		addSuffix: true,
		locale
	});

	return (
		<div
			className={`group relative flex items-center gap-3 p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
				notification.read ? '' : 'bg-violet-100 dark:bg-violet-900/20'
			}`}
		>
			<Avatar
				alt={notification.actorUsername}
				className='flex-shrink-0'
				color='initials'
				name={notification.actorUsername}
				size={40}
				src={notification.actorPhoto}
			>
				{notification.actorUsername[0].toUpperCase()}
			</Avatar>

			<div className='flex flex-grow items-start justify-between gap-8'>
				<div className='min-w-0 flex-1'>
					<div>
						<Link to={`/account/${notification.actorUsername}`}>
							<Text c='violet' className='font-semibold text-sm hover:opacity-85' component='span'>
								{notification.actorUsername}
							</Text>
						</Link>

						<br className='xxs:hidden' />
						<span className='inline max-xxs:hidden'>&nbsp;</span>

						<Text className='text-sm' component='span'>
							{t('pages.components.notifications.liked_your_post')}
						</Text>
					</div>

					<div className='mt-1 flex items-center gap-2'>
						<Text className='text-xs opacity-50'>{timeAgo}</Text>

						{!notification.read && (
							<Box
								bg='violet'
								className='h-2 w-2 rounded-full opacity-70'
								title={t('pages.components.notifications.unread')}
							/>
						)}
					</div>
				</div>

				<img
					alt={t('pages.components.notifications.post_image')}
					className='h-12 w-12 flex-shrink-0 self-center rounded object-cover transition-transform group-hover:-translate-x-6'
					src={notification.postPhoto}
				/>
			</div>

			<div className='absolute top-1/2 right-2 flex -translate-y-1/2 flex-col items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
				{!notification.read && (
					<Tooltip label={t('pages.components.notifications.mark_as_read')} withArrow>
						<ActionIcon
							color='violet'
							loading={isMarkAsReadPending}
							onClick={() => markAsRead()}
							size='sm'
							variant='light'
						>
							<IconCheck size={14} />
						</ActionIcon>
					</Tooltip>
				)}

				<Tooltip label={t('pages.components.notifications.delete')} withArrow>
					<ActionIcon
						color='red'
						loading={isDeletePending}
						onClick={() => deleteNotification()}
						size='sm'
						variant='light'
					>
						<IconX size={14} />
					</ActionIcon>
				</Tooltip>
			</div>
		</div>
	);
};
