import { Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { AppButton } from './ui';

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
		<Modal onClose={props.close} opened={props.opened} size={400} withCloseButton={false}>
			<h2 className='font-display text-[1.75rem] text-ink leading-tight'>{props.title}</h2>
			<p className='mt-3 text-[14px] text-ink-2 leading-relaxed'>{t(props.message)}</p>

			<div className='mt-8 flex items-center justify-end gap-2'>
				<AppButton onClick={props.close} variant='ghost'>
					{t(props.cancelLabel || 'common.cancel')}
				</AppButton>

				<AppButton loading={props.isLoading} onClick={props.confirm}>
					{t(props.confirmLabel || 'common.continue')}
				</AppButton>
			</div>
		</Modal>
	);
};
