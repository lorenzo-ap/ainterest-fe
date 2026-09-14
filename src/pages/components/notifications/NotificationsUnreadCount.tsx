import { useNotificationsUnreadCount } from '../../../queries';

export const NotificationsUnreadCount = () => {
	const { data: notificationsUnreadCount } = useNotificationsUnreadCount();

	if (!notificationsUnreadCount) return;

	return (
		<span className='pointer-events-none absolute top-0.5 right-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-brand px-1 font-mono text-[9px] text-white leading-none ring-2 ring-bg'>
			{notificationsUnreadCount > 9 ? '9+' : notificationsUnreadCount}
		</span>
	);
};
