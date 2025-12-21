import { Avatar, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { HeaderMenu } from '.';
import { ConfirmModal } from '../../components';
import { useCurrentUser, useSignOut } from '../../queries';
import { toastService } from '../../services';
import { SignInModal, SignUpModal } from './modals';
import { Notifications } from './notifications';

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  const { mutate: signOut, isPending } = useSignOut({
    onSuccess: () => {
      closeSignOutConfirmModal();
      toastService.success(t('apis.auth.success_sign_out'));
    }
  });

  const { pathname } = useMemo(() => location, [location]);

  const [signInModalOpened, { open: openSignInModal, close: closeSignInModal }] = useDisclosure(false);
  const [signUpModalOpened, { open: openSignUpModal, close: closeSignUpModal }] = useDisclosure(false);
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
            <Text className='group text-2xl font-semibold'>
              <Text className='text-2xl font-bold' c='violet' span>
                AI
              </Text>
              nterest
            </Text>
          </Link>

          <div className='flex items-center gap-x-2'>
            {currentUser ? (
              <>
                <Button
                  component={Link}
                  variant={pathname.includes(currentUser.username) ? 'light' : 'default'}
                  color='indigo'
                  radius='md'
                  to={`account/${currentUser.username}`}
                  className='px-2.5 max-xxs:px-[5px]'
                >
                  <Avatar
                    key={currentUser.username}
                    src={currentUser.photo}
                    name={currentUser.username}
                    color='initials'
                    size={24}
                  >
                    {currentUser.username[0].toUpperCase()}
                  </Avatar>

                  <Text className='ms-1.5 text-sm max-xxs:hidden'>{currentUser.username}</Text>
                </Button>

                <Notifications />
              </>
            ) : (
              <Button disabled={isCurrentUserLoading} onClick={openSignInModal} color='violet' variant='light'>
                {t('common.sign_in')}
              </Button>
            )}

            <HeaderMenu openSignOutConfirmModal={openSignOutConfirmModal} />
          </div>
        </div>
      </header>

      <SignInModal opened={signInModalOpened} close={closeSignInModal} openSignUpModal={openSignUpModal} />
      <SignUpModal opened={signUpModalOpened} close={closeSignUpModal} openSignInModal={openSignInModal} />
      <ConfirmModal
        title={t('pages.components.header.sign_out')}
        message={t('pages.components.header.are_you_sure')}
        isLoading={isPending}
        opened={signOutConfirmModalOpened}
        confirm={signOut}
        close={closeSignOutConfirmModal}
      />
    </>
  );
};
