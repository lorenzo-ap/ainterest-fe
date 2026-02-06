import { Button } from '@mantine/core';
import { GoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleIcon } from '../assets/icons';
import { notificationKeys, useGoogleSignIn } from '../queries';
import { toastService } from '../services';

type GoogleSignInButtonProps = {
	onSuccess: () => void;
};

export const GoogleSignInButton = ({ onSuccess }: GoogleSignInButtonProps) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const googleButtonRef = useRef<HTMLDivElement>(null);

	const { mutate: googleSignIn, isPending } = useGoogleSignIn({
		onSuccess: () => {
			onSuccess();
			toastService.success(t('apis.auth.success_sign_in'));
			queryClient.invalidateQueries({
				queryKey: notificationKeys.notifications
			});
		}
	});

	const handleCustomButtonClick = () => {
		const button = googleButtonRef.current?.querySelector('[role="button"]') as HTMLElement;
		if (!button) return;
		button.click();
	};

	return (
		<>
			<Button
				fullWidth
				leftSection={<img alt='Google' className='w-5' src={GoogleIcon} />}
				loading={isPending}
				onClick={handleCustomButtonClick}
				size='md'
				variant='default'
			>
				{t('pages.components.modals.sign_in.sign_in_with_google')}
			</Button>

			<div className='hidden' ref={googleButtonRef}>
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						if (!credentialResponse.credential) return;
						googleSignIn(credentialResponse.credential);
					}}
				/>
			</div>
		</>
	);
};
