import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CheckIcon, CloseIcon, Initials } from '../../../components/ui';
import { routes } from '../../../constants';
import { useDeleteNotification, useMarkNotificationAsRead } from '../../../queries';
import type { Notification } from '../../../types';
import { getLocale } from '../../../utils';

type NotificationItemProps = {
	notification: Notification;
	onNavigate: () => void;
};

export const NotificationItem = ({ notification, onNavigate }: NotificationItemProps) => {
	const { t, i18n } = useTranslation();

	const { mutate: markAsRead, isPending: isMarkAsReadPending } = useMarkNotificationAsRead(notification.id);
	const { mutate: deleteNotification, isPending: isDeletePending } = useDeleteNotification(notification.id);

	const locale = getLocale(i18n.language);
	const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
		addSuffix: true,
		locale
	});

	return (
		<li className='group relative mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-hover'>
			{!notification.read && (
				<span className='absolute top-1/2 left-0 h-5 w-[2px] -translate-y-1/2 rounded-full bg-brand' />
			)}

			<Link
				className='shrink-0 transition-opacity hover:opacity-75'
				onClick={onNavigate}
				to={routes.profile(notification.actor.username)}
			>
				<Initials name={notification.actor.username} size={36} src={notification.actor.photo} />
			</Link>

			<div className='min-w-0 flex-1'>
				<p className='text-[13px] text-ink-2 leading-snug'>
					<Link
						className='font-medium text-ink hover:underline'
						onClick={onNavigate}
						to={routes.profile(notification.actor.username)}
					>
						{notification.actor.username}
					</Link>{' '}
					{notification.type === 'LIKE'
						? t('pages.components.notifications.liked_your_post')
						: t('pages.components.notifications.commented_on_your_post')}
				</p>

				<p className='mt-1 font-mono text-[10px] text-ink-3 tracking-wide'>{timeAgo}</p>
			</div>

			<img
				alt={t('pages.components.notifications.post_image')}
				className='h-11 w-11 shrink-0 rounded-sm object-cover transition-transform duration-200 group-hover:-translate-x-14'
				src={notification.post.photo}
			/>

			<div className='absolute right-2 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
				{!notification.read && (
					<button
						aria-label={t('pages.components.notifications.mark_as_read')}
						className='flex h-7 w-7 items-center justify-center rounded-sm bg-brand-tint-strong text-brand transition-opacity hover:opacity-80 disabled:opacity-40'
						disabled={isMarkAsReadPending}
						onClick={() => markAsRead()}
						type='button'
					>
						<CheckIcon size={14} />
					</button>
				)}

				<button
					aria-label={t('pages.components.notifications.delete')}
					className='flex h-7 w-7 items-center justify-center rounded-sm bg-danger-tint text-danger transition-opacity hover:opacity-80 disabled:opacity-40'
					disabled={isDeletePending}
					onClick={() => deleteNotification()}
					type='button'
				>
					<CloseIcon size={14} />
				</button>
			</div>
		</li>
	);
};
