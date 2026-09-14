import { Form, useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { AppButton, Field } from '../../../components/ui';
import { EMAIL_REGEX } from '../../../constants';
import { useFormValidation } from '../../../hooks';
import { useForgotPassword } from '../../../queries';
import { toastService } from '../../../services';
import type { ForgotPasswordForm } from '../../../types';
import { AuthModalShell } from './AuthModalShell';

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

	const handleSubmit = (values: ForgotPasswordForm) => {
		forgotPassword(values);
	};

	return (
		<AuthModalShell
			description={t('pages.components.modals.forgot_password.description')}
			onClose={closeModal}
			opened={props.opened}
			title={t('common.forgot_password')}
		>
			<Form className='flex flex-col gap-4' form={form} onSubmit={handleSubmit}>
				<Field
					autoComplete='email'
					key={form.key('email')}
					label={t('common.email')}
					placeholder='you@example.com'
					{...form.getInputProps('email')}
					error={form.errors.email as string}
				/>

				<AppButton className='mt-1' fullWidth loading={isPending} type='submit'>
					{t('pages.components.modals.forgot_password.send_reset_link')}
				</AppButton>
			</Form>

			<button
				className='mt-6 w-full text-[13px] text-ink-3 transition-colors hover:text-ink'
				onClick={() => {
					closeModal();
					props.openSignInModal();
				}}
				type='button'
			>
				{t('pages.components.modals.forgot_password.back_to_sign_in')}
			</button>
		</AuthModalShell>
	);
};
