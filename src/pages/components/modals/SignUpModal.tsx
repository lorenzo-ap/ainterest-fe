import { Form, useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GoogleSignInButton } from '../../../components';
import { AppButton, Field, PasswordField } from '../../../components/ui';
import { EMAIL_REGEX, PASSWORD_REQUIREMENTS } from '../../../constants';
import { useFormValidation } from '../../../hooks';
import { notificationKeys, useSignUp } from '../../../queries';
import { toastService } from '../../../services';
import type { SignUpForm } from '../../../types';
import { AuthModalShell } from './AuthModalShell';

type SignUpModalProps = {
	opened: boolean;
	close: () => void;
	openSignInModal: () => void;
};

export const SignUpModal = (props: SignUpModalProps) => {
	const { t, i18n } = useTranslation();
	const queryClient = useQueryClient();

	const form = useForm<SignUpForm>({
		mode: 'uncontrolled',
		initialValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		},

		validate: {
			username: (value) => {
				if (!value.trim()) {
					return t('pages.components.modals.sign_up.errors.username.required');
				}

				if (value.length < 3) {
					return t('pages.components.modals.sign_up.errors.username.minLength');
				}

				if (value.length > 20) {
					return t('pages.components.modals.sign_up.errors.username.maxLength');
				}
			},
			email: (value) => {
				if (!value) {
					return t('pages.components.modals.sign_up.errors.email.required');
				}

				if (!EMAIL_REGEX.test(value)) {
					return t('pages.components.modals.sign_up.errors.email.invalid');
				}
			},
			password: (value) => {
				if (!value) return t('pages.components.modals.sign_up.errors.password.required');

				const failed = PASSWORD_REQUIREMENTS.find((req) => !req.re.test(value));
				return failed ? t(`pages.components.modals.sign_up.errors.password.requirements.${failed.key}`) : null;
			},
			confirmPassword: (value, values) => {
				if (!value) {
					return t('pages.components.modals.sign_up.errors.confirmPassword.required');
				}

				if (value !== values.password) {
					return t('pages.components.modals.sign_up.errors.confirmPassword.mismatch');
				}
			}
		}
	});

	useFormValidation(form, i18n);

	const { mutate: signUp, isPending } = useSignUp({
		onSuccess: () => {
			closeModal();
			toastService.success(t('apis.auth.success_sign_up'));
			queryClient.invalidateQueries({
				queryKey: notificationKeys.notifications
			});
		}
	});

	const closeModal = () => {
		props.close();
		form.reset();
	};

	const handleSubmit = (values: SignUpForm) => {
		signUp(values);
	};

	return (
		<AuthModalShell
			description={t('pages.components.modals.sign_up.description')}
			onClose={closeModal}
			opened={props.opened}
			title={t('common.sign_up')}
		>
			<Form className='flex flex-col gap-4' form={form} onSubmit={handleSubmit}>
				<Field
					autoComplete='username'
					key={form.key('username')}
					label={t('common.username')}
					placeholder={t('pages.components.modals.sign_up.username_placeholder')}
					{...form.getInputProps('username')}
					error={form.errors.username as string}
				/>
				<Field
					autoComplete='email'
					key={form.key('email')}
					label={t('common.email')}
					placeholder='you@example.com'
					{...form.getInputProps('email')}
					error={form.errors.email as string}
				/>
				<PasswordField
					autoComplete='new-password'
					key={form.key('password')}
					label={t('common.password')}
					{...form.getInputProps('password')}
					error={form.errors.password as string}
				/>
				<PasswordField
					autoComplete='new-password'
					key={form.key('confirmPassword')}
					label={t('common.confirm_password')}
					{...form.getInputProps('confirmPassword')}
					error={form.errors.confirmPassword as string}
				/>

				<AppButton className='mt-1' fullWidth loading={isPending} type='submit'>
					{t('common.sign_up')}
				</AppButton>
			</Form>

			<div className='my-6 flex items-center gap-3'>
				<span className='h-px flex-1 bg-line' />
				<span className='text-[12px] text-ink-3'>{t('pages.components.modals.sign_up.or_continue_with')}</span>
				<span className='h-px flex-1 bg-line' />
			</div>

			<GoogleSignInButton onSuccess={closeModal} />

			<p className='mt-7 text-center text-[13px] text-ink-3'>
				{t('pages.components.modals.sign_up.already_have_an_account')}{' '}
				<button
					className='font-medium text-brand transition-opacity hover:opacity-70'
					onClick={() => {
						closeModal();
						props.openSignInModal();
					}}
					type='button'
				>
					{t('common.sign_in')}
				</button>
			</p>
		</AuthModalShell>
	);
};
