import { Button, Container, PasswordInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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

	const submit = (values: ResetPasswordForm) => {
		if (!params.token) return;
		resetPassword({ token: params.token, ...values });
	};

	return (
		<Container className='py-12' size='xs'>
			<Text className='mb-2 text-center font-bold text-3xl'>{t('pages.reset_password.title')}</Text>
			<Text c='dimmed' className='mb-6 text-center' size='sm'>
				{t('pages.reset_password.description')}
			</Text>

			<form className='mx-auto flex max-w-screen-xxs flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
				<PasswordInput
					key={form.key('password')}
					label={t('pages.reset_password.new_password')}
					size='md'
					{...form.getInputProps('password')}
				/>

				<PasswordInput
					key={form.key('confirmPassword')}
					label={t('pages.reset_password.confirm_new_password')}
					size='md'
					{...form.getInputProps('confirmPassword')}
				/>

				<Button className='mt-2' color='violet' loading={isPending} size='md' type='submit'>
					{t('pages.reset_password.reset_password')}
				</Button>
			</form>
		</Container>
	);
};
