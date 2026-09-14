import { Form, useForm } from '@mantine/form';
import { startRegistration } from '@simplewebauthn/browser';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppButton, Field, PasswordField } from '../../../components/ui';
import { useFormValidation } from '../../../hooks';
import { useRegistrationOptions, useVerifyRegistration } from '../../../queries';
import { toastService } from '../../../services';
import type { AddPasskeyForm } from '../../../types';
import { AuthModalShell } from './AuthModalShell';

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
		<AuthModalShell
			description={t('pages.components.modals.add_passkey.description')}
			onClose={handleClose}
			opened={opened}
			title={t('pages.components.modals.add_passkey.title')}
		>
			<Form className='flex flex-col gap-4' form={form} onSubmit={handleSubmit}>
				<Field
					label={t('pages.components.modals.add_passkey.name')}
					placeholder={t('pages.components.modals.add_passkey.name_placeholder')}
					{...form.getInputProps('passkeyName')}
					error={form.errors.passkeyName as string}
				/>
				<PasswordField
					autoComplete='current-password'
					label={t('pages.components.modals.add_passkey.password')}
					{...form.getInputProps('password')}
					error={form.errors.password as string}
				/>

				<AppButton className='mt-1' fullWidth loading={isLoading} type='submit'>
					{t('pages.components.modals.add_passkey.submit')}
				</AppButton>
			</Form>
		</AuthModalShell>
	);
};
