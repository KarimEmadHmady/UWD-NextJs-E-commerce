import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addNotification, removeNotification, clearNotifications } from '@/redux/features/notifications/notificationSlice';
import { selectNotifications } from '@/redux/features/notifications/notificationSelectors';
import type { NotificationType, Notification } from '@/types';

/**
 * Custom hook for managing notifications.
 * Allows adding, removing, and clearing notifications, and provides notification state.
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  const notify = (type: NotificationType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch(addNotification({ id, type, message, duration, timestamp: Date.now() }));
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, duration);
  };

  const remove = (id: string) => dispatch(removeNotification(id));
  const clear = () => dispatch(clearNotifications());

  return {
    notifications,
    notify,
    remove,
    clear,
  };
}; 