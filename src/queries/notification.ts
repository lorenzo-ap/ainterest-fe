import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  useSuspenseQuery,
  UseSuspenseQueryOptions
} from '@tanstack/react-query';
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getNotificationsUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../api';
import { MutationOptions, Notification } from '../types';

type NotificationsOptions = Omit<UseSuspenseQueryOptions<Notification[]>, 'queryKey' | 'queryFn'>;
type NotificationsUnreadCountOptions = Omit<UseSuspenseQueryOptions<number>, 'queryKey' | 'queryFn'>;
type DeleteNotificationOptions = Omit<UseMutationOptions<Notification>, 'mutationFn'>;

export const notificationKeys = {
  notifications: ['notifications'] as const,
  notificationsUnreadCount: ['notifications', 'unread-count'] as const
};

export const useNotifications = (options?: NotificationsOptions) =>
  useSuspenseQuery({
    queryKey: notificationKeys.notifications,
    queryFn: () => getNotifications(),
    staleTime: Infinity,
    ...options
  });

export const useNotificationsUnreadCount = (options?: NotificationsUnreadCountOptions) =>
  useSuspenseQuery({
    queryKey: notificationKeys.notificationsUnreadCount,
    queryFn: () => getNotificationsUnreadCount(),
    staleTime: Infinity,
    ...options
  });

export const useMarkNotificationAsRead = (notificationId: string, options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => markNotificationAsRead(notificationId),
    onSuccess: (...args) => {
      queryClient.setQueryData<Notification[]>(notificationKeys.notifications, (oldNotifications) => {
        if (!oldNotifications) return oldNotifications;
        return oldNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        );
      });

      queryClient.setQueryData<number>(notificationKeys.notificationsUnreadCount, (oldCount) =>
        oldCount ? oldCount - 1 : 0
      );

      options?.onSuccess?.(...args);
    }
  });
};

export const useMarkAllNotificationsAsRead = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: (...args) => {
      queryClient.setQueryData<Notification[]>(notificationKeys.notifications, (oldNotifications) => {
        if (!oldNotifications) return oldNotifications;
        return oldNotifications.map((notification) => ({ ...notification, read: true }));
      });

      queryClient.setQueryData<number>(notificationKeys.notificationsUnreadCount, 0);

      options?.onSuccess?.(...args);
    }
  });
};

export const useDeleteNotification = (notificationId: string, options?: DeleteNotificationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => deleteNotification(notificationId),
    onSuccess: (...args) => {
      const [res] = args;

      queryClient.setQueryData<Notification[]>(notificationKeys.notifications, (oldNotifications) => {
        if (!oldNotifications) return oldNotifications;
        return oldNotifications.filter((n) => n._id !== notificationId);
      });

      if (res.read) return;
      queryClient.setQueryData<number>(notificationKeys.notificationsUnreadCount, (oldCount) =>
        oldCount ? oldCount - 1 : 0
      );

      options?.onSuccess?.(...args);
    }
  });
};

export const useDeleteAllNotifications = (options?: MutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => deleteAllNotifications(),
    onSuccess: (...args) => {
      queryClient.setQueryData<Notification[]>(notificationKeys.notifications, []);
      queryClient.setQueryData<number>(notificationKeys.notificationsUnreadCount, 0);
      options?.onSuccess?.(...args);
    }
  });
};
