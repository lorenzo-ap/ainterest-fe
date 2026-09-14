import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { QueryBoundary } from '../../../components';
import { AppButton, CloseIcon, PlusIcon } from '../../../components/ui';
import { AddPasskeyModal } from './AddPasskeyModal';
import { PasskeysList } from './PasskeysList';
import { PasskeysListSkeleton } from './PasskeysListSkeleton';

type PasskeysModalProps = {
	opened: boolean;
	onClose: () => void;
};

export const PasskeysModal = (props: PasskeysModalProps) => {
	const { t } = useTranslation();

	const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure();

	return (
		<>
			<Modal onClose={props.onClose} opened={props.opened} padding={0} size={560} withCloseButton={false}>
				<div className='relative px-7 pt-8 pb-8'>
					<button
						aria-label={t('common.close')}
						className='icon-btn absolute top-5 right-5 h-8 w-8'
						onClick={props.onClose}
						type='button'
					>
						<CloseIcon size={17} />
					</button>

					<header className='mb-6'>
						<h2 className='font-display text-[2rem] text-ink leading-tight'>
							{t('pages.components.modals.passkeys.title')}
						</h2>
						<p className='mt-2 max-w-sm text-[14px] text-ink-3 leading-relaxed'>
							{t('pages.components.modals.passkeys.description')}
						</p>
					</header>

					<QueryBoundary
						error={(retry) => (
							<div className='flex flex-col items-center gap-3 rounded-lg border border-line py-10 text-center'>
								<p className='text-[14px] text-ink-3'>{t('components.error_state.passkeys')}</p>
								<button
									className='text-[13px] text-brand transition-opacity hover:opacity-70'
									onClick={retry}
									type='button'
								>
									{t('components.error_state.retry')}
								</button>
							</div>
						)}
						loading={<PasskeysListSkeleton />}
					>
						<PasskeysList />
					</QueryBoundary>

					<AppButton
						className='mt-5'
						fullWidth
						leftIcon={<PlusIcon size={17} />}
						onClick={openAddModal}
						variant='outline'
					>
						{t('pages.components.modals.passkeys.add_passkey')}
					</AppButton>
				</div>
			</Modal>

			<AddPasskeyModal onClose={closeAddModal} opened={addModalOpened} />
		</>
	);
};
