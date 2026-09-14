import { useTranslation } from 'react-i18next';
import { CheckAllIcon, TrashIcon } from '../../../components/ui';
import { useDeleteAllNotifications, useMarkAllNotificationsAsRead, useNotifications } from '../../../queries';
import { toastService } from '../../../services';
import { NotificationItem } from './NotificationItem';

type NotificationDropdownProps = {
	onNavigate: () => void;
	/** The mobile sheet fills its own width; the desktop popover sizes itself. */
	fullWidth?: boolean;
};

export const NotificationDropdown = ({ onNavigate, fullWidth }: NotificationDropdownProps) => {
	const { t } = useTranslation();

	const { data: notifications } = useNotifications();
	const hasUnreadNotifications = notifications.some((n) => !n.read);

	const { mutate: markAllAsRead, isPending: isMarkAllAsReadPending } = useMarkAllNotificationsAsRead({
		onSuccess: () => {
			toastService.success(t('apis.notifications.read_all'));
		}
	});
	const { mutate: deleteAll, isPending: isDeleteAllPending } = useDeleteAllNotifications({
		onSuccess: () => {
			toastService.success(t('apis.notifications.delete_all'));
		}
	});

	return (
		<div className={`flex max-h-[min(32rem,70vh)] flex-col md:max-h-[32rem] ${fullWidth ? 'w-full' : 'w-96'}`}>
			<header className='flex items-center justify-between gap-2 px-4 pt-4 pb-3'>
				<h3 className='eyebrow'>{t('pages.components.notifications.title')}</h3>

				{!!notifications.length && (
					<div className='flex items-center gap-1'>
						{hasUnreadNotifications && (
							<button
								className='icon-btn h-7 w-7 disabled:opacity-40'
								disabled={isMarkAllAsReadPending}
								onClick={() => markAllAsRead()}
								title={t('pages.components.notifications.mark_all_as_read')}
								type='button'
							>
								<CheckAllIcon size={16} />
							</button>
						)}

						<button
							className='icon-btn h-7 w-7 hover:text-danger disabled:opacity-40'
							disabled={isDeleteAllPending}
							onClick={() => deleteAll()}
							title={t('pages.components.notifications.delete_all')}
							type='button'
						>
							<TrashIcon size={16} />
						</button>
					</div>
				)}
			</header>

			<div className='scrollbar-none flex-1 overflow-y-auto overflow-x-hidden pb-2'>
				{notifications.length ? (
					<ul className='flex flex-col'>
						{notifications.map((notification) => (
							<NotificationItem key={notification.id} notification={notification} onNavigate={onNavigate} />
						))}
					</ul>
				) : (
					<p className='px-6 py-14 text-center text-[14px] text-ink-3'>
						{t('pages.components.notifications.no_notifications_yet')}
					</p>
				)}
			</div>
		</div>
	);
};
