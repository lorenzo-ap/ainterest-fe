import { Button, Divider, Modal, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { startRegistration } from '@simplewebauthn/browser';
import { IconKey } from '@tabler/icons-react';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../../../components';
import { useFormValidation } from '../../../hooks';
import { useGetRegistrationOptions, useRevokePasskey, useVerifyRegistration } from '../../../queries';
import { toastService } from '../../../services';
import { PasskeysList } from './PasskeysList';
import { PasskeysListSkeleton } from './PasskeysListSkeleton';

type PasskeysModalProps = {
	opened: boolean;
	close: () => void;
};

export const PasskeysModal = (props: PasskeysModalProps) => {
	const { t, i18n } = useTranslation();

	const [addModalOpen, setAddModalOpen] = useState(false);
	const [revokeTarget, setRevokeTarget] = useState<{ credentialId: string; createdAt: string } | null>(null);

	const { mutate: getRegistrationOptions } = useGetRegistrationOptions();
	const { mutate: verifyRegistration, isPending: isRegistering } = useVerifyRegistration();
	const { mutate: revokePasskey, isPending: isRevoking } = useRevokePasskey();

	const addPasskeyForm = useForm({
		mode: 'uncontrolled',
		initialValues: { passkeyName: '', password: '' },
		validate: {
			passkeyName: (value) => (value ? null : t('common.errors.passkey_name_required')),
			password: (value) => (value ? null : t('common.errors.password_required'))
		}
	});

	useFormValidation(addPasskeyForm, i18n);

	const closeAddModal = () => {
		setAddModalOpen(false);
		addPasskeyForm.reset();
	};

	const handleAddPasskey = (password: string, name: string) => {
		getRegistrationOptions(password, {
			onSuccess: async (options) => {
				try {
					const cred = await startRegistration({ optionsJSON: options });
					verifyRegistration(
						{ name, credential: cred },
						{
							onSuccess: () => {
								toastService.success(t('apis.passkeys.success_register'));
								closeAddModal();
							},
							onError: (error: Error) => {
								toastService.error(error.message);
							}
						}
					);
				} catch {
					toastService.error(t('apis.passkeys.errors.registration_failed'));
				}
			},
			onError: (error: Error) => {
				toastService.error(error.message);
			}
		});
	};

	const handleRevoke = () => {
		if (!revokeTarget) return;
		revokePasskey(revokeTarget.credentialId, {
			onSuccess: () => {
				toastService.success(t('apis.passkeys.success_revoke'));
				setRevokeTarget(null);
			},
			onError: (error: Error) => {
				toastService.error(error.message);
			}
		});
	};

	const closeModal = () => {
		props.close();
		closeAddModal();
		setRevokeTarget(null);
	};

	return (
		<>
			<Modal
				onClose={closeModal}
				opened={props.opened}
				padding='lg'
				radius='md'
				size='lg'
				title={<Text className='text-center font-bold text-2xl'>{t('pages.passkeys.title')}</Text>}
			>
				<Stack gap='lg'>
					<Text c='dimmed' size='sm'>
						{t('pages.passkeys.description')}
					</Text>

					<div className='flex flex-col gap-4'>
						<div className='flex flex-col gap-2'>
							<div className='flex items-center justify-between'>
								<Text className='font-semibold text-lg'>{t('pages.passkeys.your_passkeys', 'Your Passkeys')}</Text>
								<Button
									color='violet'
									leftSection={<IconKey size={16} stroke={1.5} />}
									onClick={() => setAddModalOpen(true)}
									radius='md'
									size='xs'
									variant='light'
								>
									{t('pages.passkeys.add_passkey')}
								</Button>
							</div>
							<Divider />
						</div>

						<Suspense fallback={<PasskeysListSkeleton />}>
							<PasskeysList onRevoke={(pk) => setRevokeTarget(pk)} />
						</Suspense>
					</div>
				</Stack>
			</Modal>
			<Modal
				onClose={closeAddModal}
				opened={addModalOpen}
				padding='lg'
				radius='md'
				title={<Text className='text-center font-bold text-2xl'>{t('pages.passkeys.add_passkey')}</Text>}
			>
				<form
					className='flex flex-col gap-y-3'
					onSubmit={addPasskeyForm.onSubmit((values) => handleAddPasskey(values.password, values.passkeyName))}
				>
					<TextInput
						label={t('pages.passkeys.passkey_name')}
						placeholder={t('pages.passkeys.passkey_name_placeholder')}
						size='md'
						{...addPasskeyForm.getInputProps('passkeyName')}
					/>
					<PasswordInput
						label={t('pages.passkeys.current_password')}
						size='md'
						{...addPasskeyForm.getInputProps('password')}
					/>
					<Button className='mt-2' color='violet' loading={isRegistering} size='md' type='submit'>
						{t('pages.passkeys.add_passkey')}
					</Button>
				</form>
			</Modal>

			<ConfirmModal
				close={() => setRevokeTarget(null)}
				confirm={handleRevoke}
				isLoading={isRevoking}
				message={t('pages.passkeys.revoke_confirm')}
				opened={!!revokeTarget}
				title={t('pages.passkeys.revoke')}
			/>
		</>
	);
};
