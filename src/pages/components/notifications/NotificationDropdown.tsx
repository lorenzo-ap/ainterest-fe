import { ActionIcon, Divider, Text, Tooltip } from '@mantine/core';
import { IconBellOff, IconChecks, IconTrash } from '@tabler/icons-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeleteAllNotifications, useMarkAllNotificationsAsRead, useNotifications } from '../../../queries';
import { toastService } from '../../../services';
import { NotificationItem } from './NotificationItem';

export const NotificationDropdown = () => {
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
		<div className='flex max-h-[32rem] w-96 flex-col max-xs:w-[calc(100vw-2rem)]'>
			<div className='flex items-center justify-between px-4 py-3'>
				<Text className='font-semibold text-lg' component='h3'>
					{t('pages.components.notifications.title')}
				</Text>

				{!!notifications.length && (
					<div className='flex items-center gap-1'>
						{hasUnreadNotifications && (
							<Tooltip label={t('pages.components.notifications.mark_all_as_read')} withArrow>
								<ActionIcon
									color='violet'
									loading={isMarkAllAsReadPending}
									onClick={() => markAllAsRead()}
									size='sm'
									variant='subtle'
								>
									<IconChecks size={18} />
								</ActionIcon>
							</Tooltip>
						)}

						<Tooltip label={t('pages.components.notifications.delete_all')} withArrow>
							<ActionIcon
								color='red'
								loading={isDeleteAllPending}
								onClick={() => deleteAll()}
								size='sm'
								variant='subtle'
							>
								<IconTrash size={18} />
							</ActionIcon>
						</Tooltip>
					</div>
				)}
			</div>

			<Divider />

			<div className='scrollbar flex-1 overflow-y-auto overflow-x-hidden'>
				{notifications.length ? (
					notifications.map((notification, i) => (
						<Fragment key={notification.id}>
							<NotificationItem notification={notification} />
							{i < notifications.length - 1 && <Divider />}
						</Fragment>
					))
				) : (
					<div className='flex flex-col items-center justify-center px-4 py-12'>
						<IconBellOff className='mb-3 opacity-50' color='gray' size={64} />
						<Text className='text-sm opacity-70'>{t('pages.components.notifications.no_notifications_yet')}</Text>
					</div>
				)}
			</div>
		</div>
	);
};
