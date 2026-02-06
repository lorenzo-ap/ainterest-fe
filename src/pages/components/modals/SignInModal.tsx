import { Button, Divider, Modal, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GoogleSignInButton } from '../../../components';
import { EMAIL_REGEX } from '../../../constants';
import { useFormValidation } from '../../../hooks';
import { notificationKeys, useSignIn } from '../../../queries';
import { toastService } from '../../../services';
import type { SignInForm } from '../../../types';

type SignInModalProps = {
	opened: boolean;
	close: () => void;
	openSignUpModal: () => void;
	openForgotPasswordModal: () => void;
};

export const SignInModal = (props: SignInModalProps) => {
	const { t, i18n } = useTranslation();
	const queryClient = useQueryClient();

	const form = useForm<SignInForm>({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			password: ''
		},

		validate: {
			email: (value) => {
				if (!value) {
					return t('pages.components.modals.sign_in.errors.email.required');
				}

				if (!EMAIL_REGEX.test(value)) {
					return t('pages.components.modals.sign_in.errors.email.invalid');
				}
			},
			password: (value) => {
				if (!value) return t('pages.components.modals.sign_in.errors.password.required');
			}
		}
	});

	useFormValidation(form, i18n);

	const { mutate: signIn, isPending } = useSignIn({
		onSuccess: () => {
			closeModal();
			toastService.success(t('apis.auth.success_sign_in'));
			queryClient.invalidateQueries({
				queryKey: notificationKeys.notifications
			});
		}
	});

	const closeModal = () => {
		props.close();
		form.reset();
	};

	const submit = (values: SignInForm) => {
		signIn(values);
	};

	return (
		<Modal
			onClose={closeModal}
			opened={props.opened}
			padding='lg'
			radius='md'
			title={<Text className='text-center font-bold text-2xl'>{t('common.sign_in')}</Text>}
		>
			<form className='flex flex-col gap-y-3' onSubmit={form.onSubmit(submit)}>
				<TextInput key={form.key('email')} label={t('common.email')} size='md' {...form.getInputProps('email')} />
				<PasswordInput
					key={form.key('password')}
					label={t('common.password')}
					size='md'
					{...form.getInputProps('password')}
					className='relative'
					inputContainer={(children) => (
						<>
							{children}

							<Button
								className='absolute top-0 right-0 h-[1.563rem] p-0 font-medium text-xs hover:opacity-80'
								color='violet'
								onClick={() => {
									closeModal();
									props.openForgotPasswordModal();
								}}
								variant='transparent'
							>
								{t('pages.components.modals.sign_in.forgot_password')}
							</Button>
						</>
					)}
				/>

				<Button className='mt-2' color='violet' loading={isPending} size='md' type='submit'>
					{t('common.sign_in')}
				</Button>
			</form>

			<Divider className='my-4' label={t('pages.components.modals.sign_in.or_continue_with')} labelPosition='center' />

			<GoogleSignInButton onSuccess={closeModal} />

			<Text className='mt-4 flex items-center justify-center gap-x-1' size='sm'>
				<span>{t('pages.components.modals.sign_in.dont_have_an_account')}</span>{' '}
				<Button
					className='p-0 hover:opacity-80'
					color='violet'
					onClick={() => {
						closeModal();
						props.openSignUpModal();
					}}
					variant='transparent'
				>
					{t('common.sign_up')}
				</Button>
			</Text>
		</Modal>
	);
};
