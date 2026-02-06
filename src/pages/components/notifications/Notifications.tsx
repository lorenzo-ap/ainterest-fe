import { ActionIcon, Popover } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationDropdown, NotificationsSkeleton, NotificationsUnreadCount } from '.';

export const Notifications = () => {
	const { t } = useTranslation();

	return (
		<Popover arrowOffset={16} arrowSize={10} position='bottom' shadow='md' withArrow>
			<Popover.Target>
				<div className='relative'>
					<ActionIcon aria-label={t('pages.components.header.notifications')} radius='md' size={36} variant='default'>
						<IconBell size={18} />
					</ActionIcon>

					<Suspense>
						<NotificationsUnreadCount />
					</Suspense>
				</div>
			</Popover.Target>

			<Popover.Dropdown className='p-0'>
				<Suspense fallback={<NotificationsSkeleton />}>
					<NotificationDropdown />
				</Suspense>
			</Popover.Dropdown>
		</Popover>
	);
};
