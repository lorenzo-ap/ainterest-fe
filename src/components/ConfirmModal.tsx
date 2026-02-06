import { Button, Modal, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

type ConfirmModalProps = {
	opened: boolean;
	title: string;
	message: string;
	confirm: () => void;
	close: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
	isLoading?: boolean;
};

export const ConfirmModal = (props: ConfirmModalProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			onClose={props.close}
			opened={props.opened}
			padding='lg'
			radius='md'
			title={<Text className='text-center font-bold text-2xl'>{props.title}</Text>}
		>
			<Text c='dimmed' className='mb-5'>
				{t(props.message)}
			</Text>

			<div className='flex items-center justify-end gap-x-3'>
				<Button color='red' onClick={props.close} variant='subtle'>
					{t(props.cancelLabel || 'common.cancel')}
				</Button>

				<Button color='teal' loading={props.isLoading} onClick={props.confirm}>
					{t(props.confirmLabel || 'common.continue')}
				</Button>
			</div>
		</Modal>
	);
};
