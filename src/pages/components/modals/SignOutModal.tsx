import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../../../components';
import { notificationKeys, useSignOut } from '../../../queries';
import { toastService } from '../../../services';

type SignOutModalProps = {
	opened: boolean;
	onClose: () => void;
};

export const SignOutModal = ({ opened, onClose }: SignOutModalProps) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { mutate: signOut, isPending } = useSignOut({
		onSuccess: () => {
			onClose();
			toastService.success(t('apis.auth.success_sign_out'));
			queryClient.removeQueries({
				queryKey: notificationKeys.notifications
			});
		}
	});

	return (
		<ConfirmModal
			close={onClose}
			confirm={signOut}
			isLoading={isPending}
			message={t('pages.components.header.are_you_sure')}
			opened={opened}
			title={t('pages.components.header.sign_out')}
		/>
	);
};
