import { Button, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
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
			<Modal
				onClose={props.onClose}
				opened={props.opened}
				padding='lg'
				radius='md'
				size='lg'
				title={<Text className='text-center font-bold text-2xl'>{t('pages.components.modals.passkeys.title')}</Text>}
			>
				<Stack gap='md'>
					<Suspense fallback={<PasskeysListSkeleton />}>
						<PasskeysList />
					</Suspense>

					<Button color='violet' onClick={openAddModal} radius='md' variant='light'>
						{t('pages.components.modals.passkeys.add_passkey')}
					</Button>
				</Stack>
			</Modal>

			<AddPasskeyModal onClose={closeAddModal} opened={addModalOpened} />
		</>
	);
};
