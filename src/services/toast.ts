import { showNotification } from '@mantine/notifications';

export const toastService = {
	success: (message: string, autoClose = 5000) => {
		showNotification({
			message,
			color: 'green',
			radius: 'md',
			autoClose
		});
	},

	error: (message = 'An error occurred.', autoClose = 5000) => {
		showNotification({
			message,
			color: 'red',
			radius: 'md',
			autoClose
		});
	}
};
