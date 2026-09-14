import { Form, useForm } from '@mantine/form';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser';
import { startAuthentication } from '@simplewebauthn/browser';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleSignInButton } from '../../../components';
import { AppButton, Field, PasswordField } from '../../../components/ui';
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
import { AuthModalShell } from './AuthModalShell';

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
		<AuthModalShell
			description={t('pages.components.modals.sign_in.description')}
			onClose={closeModal}
			opened={props.opened}
			title={t('common.sign_in')}
		>
			<Form className='flex flex-col gap-4' form={form} onSubmit={handleSubmit}>
				<Field
					action={
						step === 'password' && (
							<button
								className='px-1 text-[12px] text-brand transition-opacity hover:opacity-70'
								onClick={resetToEmailStep}
								type='button'
							>
								{t('pages.components.modals.sign_in.change_email')}
							</button>
						)
					}
					autoComplete='email'
					key={form.key('email')}
					label={t('common.email')}
					placeholder='you@example.com'
					readOnly={step === 'password'}
					{...form.getInputProps('email')}
					error={form.errors.email as string}
				/>

				{step === 'password' && (
					<div className='animate-rise'>
						<PasswordField
							autoComplete='current-password'
							key={form.key('password')}
							label={t('common.password')}
							{...form.getInputProps('password')}
							error={form.errors.password as string}
						/>

						<button
							className='mt-2.5 text-[12px] text-ink-3 transition-colors hover:text-brand'
							onClick={() => {
								closeModal();
								props.openForgotPasswordModal();
							}}
							type='button'
						>
							{t('pages.components.modals.sign_in.forgot_password')}
						</button>
					</div>
				)}

				<AppButton
					className='mt-1'
					fullWidth
					loading={step === 'email' ? isAuthenticationOptionsPending : isSignInPending}
					type='submit'
				>
					{t(step === 'email' ? 'common.continue' : 'common.sign_in')}
				</AppButton>
			</Form>

			<div className='my-6 flex items-center gap-3'>
				<span className='h-px flex-1 bg-line' />
				<span className='text-[12px] text-ink-3'>{t('pages.components.modals.sign_in.or_continue_with')}</span>
				<span className='h-px flex-1 bg-line' />
			</div>

			<div className='flex flex-col gap-2.5'>
				{passkeyOptions && (
					<AppButton fullWidth loading={isVerifyAuthenticationPending} onClick={handlePasskeyLogin} variant='outline'>
						{t('pages.components.modals.sign_in.sign_in_with_passkey')}
					</AppButton>
				)}

				<GoogleSignInButton onSuccess={closeModal} />
			</div>

			<p className='mt-7 text-center text-[13px] text-ink-3'>
				{t('pages.components.modals.sign_in.dont_have_an_account')}{' '}
				<button
					className='font-medium text-brand transition-opacity hover:opacity-70'
					onClick={() => {
						closeModal();
						props.openSignUpModal();
					}}
					type='button'
				>
					{t('common.sign_up')}
				</button>
			</p>
		</AuthModalShell>
	);
};
