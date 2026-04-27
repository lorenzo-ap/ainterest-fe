import { Button, Modal, PasswordInput, Text, TextInput } from '@mantine/core';
import { Form, useForm } from '@mantine/form';
import { startRegistration } from '@simplewebauthn/browser';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '../../../hooks';
import { useRegistrationOptions, useVerifyRegistration } from '../../../queries';
import { toastService } from '../../../services';
import type { AddPasskeyForm } from '../../../types';

type AddPasskeyModalProps = {
	opened: boolean;
	onClose: () => void;
};

export const AddPasskeyModal = ({ opened, onClose }: AddPasskeyModalProps) => {
	const { t, i18n } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);

	const { mutate: getRegistrationOptions } = useRegistrationOptions({
		onSuccess: async (options) => {
			try {
				const cred = await startRegistration({ optionsJSON: options });
				verifyRegistration({ name: form.getValues().passkeyName, credential: cred });
			} catch {
				setIsLoading(false);
			}
		},
		onError: () => {
			setIsLoading(false);
		}
	});
	const { mutate: verifyRegistration } = useVerifyRegistration({
		onSuccess: () => {
			toastService.success(t('apis.passkeys.success_register'));
			handleClose();
		},
		onSettled: () => {
			setIsLoading(false);
		}
	});

	const form = useForm<AddPasskeyForm>({
		mode: 'uncontrolled',
		initialValues: { passkeyName: '', password: '' },
		validate: {
			passkeyName: (value) => (value ? null : t('pages.components.modals.add_passkey.errors.name.required')),
			password: (value) => (value ? null : t('pages.components.modals.add_passkey.errors.password.required'))
		}
	});

	useFormValidation(form, i18n);

	const handleClose = () => {
		onClose();
		form.reset();
		setIsLoading(false);
	};

	const handleSubmit = (values: AddPasskeyForm) => {
		setIsLoading(true);
		getRegistrationOptions({ password: values.password });
	};

	return (
		<Modal
			onClose={handleClose}
			opened={opened}
			padding='lg'
			radius='md'
			title={<Text className='text-center font-bold text-2xl'>{t('pages.components.modals.add_passkey.title')}</Text>}
		>
			<Form className='flex flex-col gap-y-3' form={form} onSubmit={handleSubmit}>
				<TextInput
					label={t('pages.components.modals.add_passkey.name')}
					placeholder={t('pages.components.modals.add_passkey.name_placeholder')}
					size='md'
					{...form.getInputProps('passkeyName')}
				/>
				<PasswordInput
					label={t('pages.components.modals.add_passkey.password')}
					size='md'
					{...form.getInputProps('password')}
				/>
				<Button className='mt-2' color='violet' loading={isLoading} size='md' type='submit'>
					{t('pages.components.modals.add_passkey.submit')}
				</Button>
			</Form>
		</Modal>
	);
};
