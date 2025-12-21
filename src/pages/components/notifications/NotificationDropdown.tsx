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
        <Text component='h3' className='text-lg font-semibold'>
          {t('pages.components.notifications.title')}
        </Text>

        {!!notifications.length && (
          <div className='flex items-center gap-1'>
            {hasUnreadNotifications && (
              <Tooltip label={t('pages.components.notifications.mark_all_as_read')} withArrow>
                <ActionIcon
                  variant='subtle'
                  color='violet'
                  size='sm'
                  onClick={() => markAllAsRead()}
                  loading={isMarkAllAsReadPending}
                >
                  <IconChecks size={18} />
                </ActionIcon>
              </Tooltip>
            )}

            <Tooltip label={t('pages.components.notifications.delete_all')} withArrow>
              <ActionIcon
                variant='subtle'
                color='red'
                size='sm'
                onClick={() => deleteAll()}
                loading={isDeleteAllPending}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </div>
        )}
      </div>

      <Divider />

      <div className='scrollbar flex-1 overflow-y-auto overflow-x-hidden'>
        {!notifications.length ? (
          <div className='flex flex-col items-center justify-center px-4 py-12'>
            <IconBellOff size={64} color='gray' className='mb-3 opacity-50' />
            <Text className='text-sm opacity-70'>{t('pages.components.notifications.no_notifications_yet')}</Text>
          </div>
        ) : (
          notifications.map((notification, i) => (
            <Fragment key={notification._id}>
              <NotificationItem notification={notification} />
              {i < notifications.length - 1 && <Divider />}
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
};
