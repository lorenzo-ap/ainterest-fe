import { showNotification } from '@mantine/notifications';

/**
 * Toasts are a whisper: one line, one dot, no icon, no close button.
 * Anything that needs more than that belongs on the page, not in a toast.
 */
const show = (message: string, color: string, autoClose: number) => {
	showNotification({
		message,
		color,
		autoClose,
		withCloseButton: false,
		withBorder: false
	});
};

export const toastService = {
	success: (message: string, autoClose = 3000) => show(message, 'violet', autoClose),

	error: (message = 'An error occurred.', autoClose = 4000) => show(message, 'red', autoClose)
};
