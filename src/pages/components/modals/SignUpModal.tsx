import { Button, Divider, Modal, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GoogleSignInButton } from '../../../components';
import { EMAIL_REGEX, PASSWORD_REQUIREMENTS } from '../../../constants';
import { useFormValidation } from '../../../hooks';
import { notificationKeys, useSignUp } from '../../../queries';
import { toastService } from '../../../services';
import type { SignUpForm } from '../../../types';

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

	const submit = (values: SignUpForm) => {
		signUp(values);
	};

	return (
		<Modal
			onClose={closeModal}
			opened={props.opened}
			padding='lg'
			radius='md'
			title={<Text className='text-center font-bold text-2xl'>{t('common.sign_up')}</Text>}
		>
			<form className='flex flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
				<TextInput
					key={form.key('username')}
					label={t('common.username')}
					size='md'
					{...form.getInputProps('username')}
				/>
				<TextInput key={form.key('email')} label={t('common.email')} size='md' {...form.getInputProps('email')} />
				<PasswordInput
					key={form.key('password')}
					label={t('common.password')}
					size='md'
					{...form.getInputProps('password')}
				/>
				<PasswordInput
					key={form.key('confirmPassword')}
					label={t('common.confirm_password')}
					size='md'
					{...form.getInputProps('confirmPassword')}
				/>

				<Button className='mt-2' color='violet' loading={isPending} size='md' type='submit'>
					{t('common.sign_up')}
				</Button>
			</form>

			<Divider className='my-4' label={t('pages.components.modals.sign_up.or_continue_with')} labelPosition='center' />

			<GoogleSignInButton onSuccess={closeModal} />

			<Text className='mt-4 flex items-center justify-center gap-x-1' size='sm'>
				<span>{t('pages.components.modals.sign_up.already_have_an_account')}</span>{' '}
				<Button
					className='p-0 hover:opacity-80'
					color='violet'
					onClick={() => {
						closeModal();
						props.openSignInModal();
					}}
					variant='transparent'
				>
					{t('common.sign_in')}
				</Button>
			</Text>
		</Modal>
	);
};
