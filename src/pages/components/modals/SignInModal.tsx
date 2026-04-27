import { Button, Divider, Modal, PasswordInput, Text, TextInput } from '@mantine/core';
import { Form, useForm } from '@mantine/form';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser';
import { startAuthentication } from '@simplewebauthn/browser';
import { IconFingerprintScan } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleSignInButton } from '../../../components';
import { EMAIL_REGEX } from '../../../constants';
import { useFormValidation } from '../../../hooks';
import {
	notificationKeys,
	useGetAuthenticationOptions,
	userKeys,
	useSignIn,
	useVerifyAuthentication
} from '../../../queries';
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
	const [step, setStep] = useState<'email' | 'password'>('email');
	const [passkeyOptions, setPasskeyOptions] = useState<PublicKeyCredentialRequestOptionsJSON | null>(null);

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
				if (step === 'password' && !value) {
					return t('pages.components.modals.sign_in.errors.password.required');
				}
			}
		}
	});

	useFormValidation(form, i18n);

	const { mutate: signIn, isPending: isSignInPending } = useSignIn({
		onSuccess: () => {
			closeModal();
			toastService.success(t('apis.auth.success_sign_in'));
			queryClient.invalidateQueries({
				queryKey: notificationKeys.notifications
			});
		}
	});

	const { mutate: getAuthenticationOptions, isPending: isAuthenticationOptionsPending } = useGetAuthenticationOptions();
	const { mutate: verifyAuthentication, isPending: isVerifyAuthenticationPending } = useVerifyAuthentication();

	const resetToEmailStep = () => {
		setStep('email');
		setPasskeyOptions(null);
		form.setFieldValue('password', '');
	};

	const closeModal = () => {
		props.close();
		form.reset();
		resetToEmailStep();
	};

	const handleEmailContinue = (email: string) => {
		getAuthenticationOptions(
			{ email },
			{
				onSuccess: (options) => {
					if ((options as { challenge?: string }).challenge) {
						setPasskeyOptions(options as PublicKeyCredentialRequestOptionsJSON);
					} else {
						setPasskeyOptions(null);
					}
				},
				onError: () => {
					setPasskeyOptions(null);
				},
				onSettled: () => {
					setStep('password');
				}
			}
		);
	};

	const handlePasskeyLogin = () => {
		if (!passkeyOptions) return;
		const { email } = form.getValues();
		startAuthentication({ optionsJSON: passkeyOptions })
			.then((cred) => {
				verifyAuthentication(
					{ email, credential: cred },
					{
						onSuccess: (user) => {
							queryClient.setQueryData(userKeys.current, user);
							queryClient.invalidateQueries({ queryKey: notificationKeys.notifications });
							toastService.success(t('apis.passkeys.success_login'));
							closeModal();
						},
						onError: (error: Error) => {
							toastService.error(error.message);
						}
					}
				);
			})
			.catch(() => {
				toastService.error(t('apis.passkeys.errors.authentication_failed'));
			});
	};

	const handleSubmit = (values: SignInForm) => {
		if (step === 'email') {
			handleEmailContinue(values.email);
			return;
		}

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
			<Form className='flex flex-col gap-y-3' form={form} onSubmit={handleSubmit}>
				<TextInput
					className='relative'
					key={form.key('email')}
					label={t('common.email')}
					size='md'
					{...form.getInputProps('email')}
					inputContainer={(children) => (
						<>
							{children}

							{step === 'password' && (
								<Button
									className='absolute top-0 right-0 h-[1.563rem] p-0 font-medium text-xs hover:opacity-80'
									color='violet'
									onClick={resetToEmailStep}
									type='button'
									variant='transparent'
								>
									{t('pages.components.modals.sign_in.change_email')}
								</Button>
							)}
						</>
					)}
					readOnly={step === 'password'}
				/>

				{step === 'password' && (
					<PasswordInput
						className='relative'
						key={form.key('password')}
						label={t('common.password')}
						size='md'
						{...form.getInputProps('password')}
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
									type='button'
									variant='transparent'
								>
									{t('pages.components.modals.sign_in.forgot_password')}
								</Button>
							</>
						)}
					/>
				)}

				{step === 'email' ? (
					<Button className='mt-2' color='violet' loading={isAuthenticationOptionsPending} size='md' type='submit'>
						{t('common.continue')}
					</Button>
				) : (
					<Button className='mt-2' color='violet' loading={isSignInPending} size='md' type='submit'>
						{t('common.sign_in')}
					</Button>
				)}
			</Form>

			<Divider className='my-4' label={t('pages.components.modals.sign_in.or_continue_with')} labelPosition='center' />

			{passkeyOptions && (
				<Button
					className='mt-2 mb-3'
					color='violet'
					fullWidth
					leftSection={<IconFingerprintScan color='#9775FA' />}
					loading={isVerifyAuthenticationPending}
					onClick={handlePasskeyLogin}
					size='md'
					variant='default'
				>
					{t('pages.components.modals.sign_in.sign_in_with_passkey')}
				</Button>
			)}

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
