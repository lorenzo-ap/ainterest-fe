import { showNotification } from '@mantine/notifications';

export const toastService = {
  success: (message: string, autoClose?: number) => {
    showNotification({
      message: message,
      color: 'green',
      radius: 'md',
      autoClose
    });
  },

  error: (message = 'An error occurred.', autoClose?: number) => {
    showNotification({
      message: message,
      color: 'red',
      radius: 'md',
      autoClose
    });
  }
};
