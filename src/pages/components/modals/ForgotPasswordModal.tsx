import { Button, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { EMAIL_REGEX } from '../../../constants';
import { useFormValidation } from '../../../hooks';
import { useForgotPassword } from '../../../queries';
import { toastService } from '../../../services';
import type { ForgotPasswordForm } from '../../../types';

type ForgotPasswordModalProps = {
	opened: boolean;
	close: () => void;
	openSignInModal: () => void;
};

export const ForgotPasswordModal = (props: ForgotPasswordModalProps) => {
	const { t, i18n } = useTranslation();

	const form = useForm<ForgotPasswordForm>({
		mode: 'uncontrolled',
		initialValues: {
			email: ''
		},

		validate: {
			email: (value) => {
				if (!value) {
					return t('pages.components.modals.forgot_password.errors.email.required');
				}

				if (!EMAIL_REGEX.test(value)) {
					return t('pages.components.modals.forgot_password.errors.email.invalid');
				}
			}
		}
	});

	useFormValidation(form, i18n);

	const { mutate: forgotPassword, isPending } = useForgotPassword({
		onSuccess: () => {
			closeModal();
			toastService.success(t('apis.auth.success_forgot_password'));
		}
	});

	const closeModal = () => {
		props.close();
		form.reset();
	};

	const submit = (values: ForgotPasswordForm) => {
		forgotPassword(values);
	};

	return (
		<Modal
			onClose={closeModal}
			opened={props.opened}
			padding='lg'
			radius='md'
			title={<Text className='text-center font-bold text-2xl'>{t('common.forgot_password')}</Text>}
		>
			<form className='flex flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
				<TextInput key={form.key('email')} label={t('common.email')} size='md' {...form.getInputProps('email')} />

				<Button className='mt-2' color='violet' loading={isPending} size='md' type='submit'>
					{t('pages.components.modals.forgot_password.send_reset_link')}
				</Button>
			</form>

			<Text className='mt-4 flex items-center justify-center gap-x-1' size='sm'>
				<Button
					className='p-0 hover:opacity-80'
					color='violet'
					onClick={() => {
						closeModal();
						props.openSignInModal();
					}}
					variant='transparent'
				>
					{t('pages.components.modals.forgot_password.back_to_sign_in')}
				</Button>
			</Text>
		</Modal>
	);
};
