import { Badge } from '@mantine/core';
import { useNotificationsUnreadCount } from '../../../queries';

export const NotificationsUnreadCount = () => {
	const { data: notificationsUnreadCount } = useNotificationsUnreadCount();

	if (!notificationsUnreadCount) return;

	return (
		<Badge
			circle
			className='pointer-events-none absolute -top-1.5 -right-1.5 h-[18px] w-[18px] p-0 text-[0.625rem]'
			color='red'
			size='xs'
		>
			{notificationsUnreadCount > 99 ? '99' : notificationsUnreadCount}
		</Badge>
	);
};
