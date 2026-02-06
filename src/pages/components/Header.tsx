import { Avatar, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ConfirmModal } from '../../components';
import { notificationKeys, useCurrentUser, useSignOut } from '../../queries';
import { toastService } from '../../services';
import { HeaderMenu } from '.';
import { ForgotPasswordModal, SignInModal, SignUpModal } from './modals';
import { Notifications } from './notifications';

export const Header = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const queryClient = useQueryClient();

	const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

	const { mutate: signOut, isPending } = useSignOut({
		onSuccess: () => {
			closeSignOutConfirmModal();
			toastService.success(t('apis.auth.success_sign_out'));
			queryClient.removeQueries({
				queryKey: notificationKeys.notifications
			});
		}
	});

	const { pathname } = useMemo(() => location, [location]);

	const [signInModalOpened, { open: openSignInModal, close: closeSignInModal }] = useDisclosure(false);
	const [signUpModalOpened, { open: openSignUpModal, close: closeSignUpModal }] = useDisclosure(false);
	const [forgotPasswordModalOpened, { open: openForgotPasswordModal, close: closeForgotPasswordModal }] =
		useDisclosure(false);
	const [signOutConfirmModalOpened, { open: openSignOutConfirmModal, close: closeSignOutConfirmModal }] =
		useDisclosure(false);

	useEffect(() => {
		const lang = localStorage.getItem('lang');
		localStorage.setItem('lang', lang || 'en');
	}, []);

	return (
		<>
			<header className='header flex w-full items-center justify-between border-b px-4 py-5 sm:px-8'>
				<div className='mx-auto flex w-full max-w-7xl items-center justify-between'>
					<Link className='relative transition-opacity duration-150 hover:opacity-75' to='/'>
						<Text className='group font-semibold text-2xl'>
							<Text c='violet' className='font-bold text-2xl' span>
								AI
							</Text>
							nterest
						</Text>
					</Link>

					<div className='flex items-center gap-x-2'>
						{currentUser ? (
							<>
								<Button
									className='px-2.5 max-xxs:px-[5px]'
									color='indigo'
									component={Link}
									radius='md'
									to={`account/${currentUser.username}`}
									variant={pathname.includes(currentUser.username) ? 'light' : 'default'}
								>
									<Avatar
										color='initials'
										key={currentUser.username}
										name={currentUser.username}
										size={24}
										src={currentUser.photo}
									>
										{currentUser.username[0].toUpperCase()}
									</Avatar>

									<Text className='ms-1.5 text-sm max-xxs:hidden'>{currentUser.username}</Text>
								</Button>

								<Notifications />
							</>
						) : (
							<Button color='violet' disabled={isCurrentUserLoading} onClick={openSignInModal} variant='light'>
								{t('common.sign_in')}
							</Button>
						)}

						<HeaderMenu openSignOutConfirmModal={openSignOutConfirmModal} />
					</div>
				</div>
			</header>

			<SignInModal
				close={closeSignInModal}
				opened={signInModalOpened}
				openForgotPasswordModal={openForgotPasswordModal}
				openSignUpModal={openSignUpModal}
			/>
			<SignUpModal close={closeSignUpModal} opened={signUpModalOpened} openSignInModal={openSignInModal} />
			<ForgotPasswordModal
				close={closeForgotPasswordModal}
				opened={forgotPasswordModalOpened}
				openSignInModal={openSignInModal}
			/>
			<ConfirmModal
				close={closeSignOutConfirmModal}
				confirm={signOut}
				isLoading={isPending}
				message={t('pages.components.header.are_you_sure')}
				opened={signOutConfirmModalOpened}
				title={t('pages.components.header.sign_out')}
			/>
		</>
	);
};
