import { Form, useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AppButton, PasswordField, Wordmark } from '../../components/ui';
import { PASSWORD_REQUIREMENTS } from '../../constants';
import { useFormValidation } from '../../hooks';
import { useResetPassword } from '../../queries';
import { toastService } from '../../services';
import type { ResetPasswordForm } from '../../types';

export const ResetPasswordPage = () => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const params = useParams<{ token: string }>();

	useEffect(() => {
		if (!params.token) {
			toastService.error(t('pages.reset_password.errors.invalid_token'));
			navigate('/');
		}
	}, [params.token, navigate, t]);

	const form = useForm<ResetPasswordForm>({
		mode: 'uncontrolled',
		initialValues: {
			password: '',
			confirmPassword: ''
		},

		validate: {
			password: (value) => {
				if (!value) return t('pages.reset_password.errors.password.required');

				const failed = PASSWORD_REQUIREMENTS.find((req) => !req.re.test(value));
				return failed ? t(`pages.reset_password.errors.password.requirements.${failed.key}`) : null;
			},
			confirmPassword: (value, values) => {
				if (!value) {
					return t('pages.reset_password.errors.confirmPassword.required');
				}

				if (value !== values.password) {
					return t('pages.reset_password.errors.confirmPassword.mismatch');
				}
			}
		}
	});

	useFormValidation(form, i18n);

	const { mutate: resetPassword, isPending } = useResetPassword({
		onSuccess: () => {
			toastService.success(t('apis.auth.success_reset_password'));
			navigate('/');
		}
	});

	const handleSubmit = (values: ResetPasswordForm) => {
		if (!params.token) return;
		resetPassword({ token: params.token, ...values });
	};

	return (
		<div className='flex min-h-[calc(100dvh-var(--header-h))] items-center justify-center px-5 py-16'>
			<div className='w-full max-w-[420px]'>
				<Wordmark className='!text-[15px]' />

				<h1 className='mt-5 font-display text-[2rem] text-ink leading-tight'>{t('pages.reset_password.title')}</h1>
				<p className='mt-2 text-[14px] text-ink-3 leading-relaxed'>{t('pages.reset_password.description')}</p>

				<Form className='mt-7 flex flex-col gap-4' form={form} onSubmit={handleSubmit}>
					<PasswordField
						autoComplete='new-password'
						key={form.key('password')}
						label={t('pages.reset_password.new_password')}
						{...form.getInputProps('password')}
						error={form.errors.password as string}
					/>

					<PasswordField
						autoComplete='new-password'
						key={form.key('confirmPassword')}
						label={t('pages.reset_password.confirm_new_password')}
						{...form.getInputProps('confirmPassword')}
						error={form.errors.confirmPassword as string}
					/>

					<AppButton className='mt-1' fullWidth loading={isPending} type='submit'>
						{t('pages.reset_password.reset_password')}
					</AppButton>
				</Form>
			</div>
		</div>
	);
};
