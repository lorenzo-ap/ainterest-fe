import { apis } from '../assets/apis/apis';
import { Notification, NotificationsUnreadCount } from '../types';
import { req } from './axios';

export const getNotifications = async () => {
  const res = await req.get<Notification[]>(`v1/${apis.notifications}`);
  return res.data;
};

export const getNotificationsUnreadCount = async () => {
  const res = await req.get<NotificationsUnreadCount>(`v1/${apis.notifications}/unread-count`);
  return res.data.count;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const res = await req.put<Notification>(`v1/${apis.notifications}/${notificationId}/read`);
  return res.data;
};
export const markAllNotificationsAsRead = () => req.put(`v1/${apis.notifications}/mark-all-read`);

export const deleteNotification = async (notificationId: string) => {
  const res = await req.delete<Notification>(`v1/${apis.notifications}/${notificationId}`);
  return res.data;
};
export const deleteAllNotifications = () => req.delete(`v1/${apis.notifications}/delete-all`);
