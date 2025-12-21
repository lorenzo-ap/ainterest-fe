import { ActionIcon, Avatar, Box, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { formatDistanceToNow, Locale } from 'date-fns';
import { enUS, ro } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDeleteNotification, useMarkNotificationAsRead } from '../../../queries';
import { Notification } from '../../../types';

const locales = {
  en: enUS,
  ro: ro
};

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { t, i18n } = useTranslation();

  const { mutate: markAsRead, isPending: isMarkAsReadPending } = useMarkNotificationAsRead(notification._id);
  const { mutate: deleteNotification, isPending: isDeletePending } = useDeleteNotification(notification._id);

  const locale = (locales as Record<string, Locale>)[i18n.language] ?? enUS;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale
  });

  return (
    <div
      className={`group relative flex items-center gap-3 p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
        !notification.read ? 'bg-violet-100 dark:bg-violet-900/20' : ''
      }`}
    >
      <Avatar
        src={notification.actorPhoto}
        alt={notification.actorUsername}
        name={notification.actorUsername}
        color='initials'
        size={40}
        className='flex-shrink-0'
      >
        {notification.actorUsername[0].toUpperCase()}
      </Avatar>

      <div className='flex flex-grow items-start justify-between gap-8'>
        <div className='min-w-0 flex-1'>
          <div>
            <Link to={`/account/${notification.actorUsername}`}>
              <Text component='span' c='violet' className='text-sm font-semibold hover:opacity-85'>
                {notification.actorUsername}
              </Text>
            </Link>

            <br className='xxs:hidden' />
            <span className='inline max-xxs:hidden'>&nbsp;</span>

            <Text component='span' className='text-sm'>
              {t('pages.components.notifications.liked_your_post')}
            </Text>
          </div>

          <div className='mt-1 flex items-center gap-2'>
            <Text className='text-xs opacity-50'>{timeAgo}</Text>

            {!notification.read && (
              <Box
                bg='violet'
                title={t('pages.components.notifications.unread')}
                className='h-2 w-2 rounded-full opacity-70'
              />
            )}
          </div>
        </div>

        <img
          src={notification.postPhoto}
          alt={t('pages.components.notifications.post_image')}
          className='h-12 w-12 flex-shrink-0 self-center rounded object-cover transition-transform group-hover:-translate-x-6'
        />
      </div>

      <div className='absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
        {!notification.read && (
          <Tooltip label={t('pages.components.notifications.mark_as_read')} withArrow>
            <ActionIcon
              variant='light'
              color='violet'
              size='sm'
              onClick={() => markAsRead()}
              loading={isMarkAsReadPending}
            >
              <IconCheck size={14} />
            </ActionIcon>
          </Tooltip>
        )}

        <Tooltip label={t('pages.components.notifications.delete')} withArrow>
          <ActionIcon
            variant='light'
            color='red'
            size='sm'
            onClick={() => deleteNotification()}
            loading={isDeletePending}
          >
            <IconX size={14} />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
};
