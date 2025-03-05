import {
  ActionIcon,
  Avatar,
  Button,
  Text,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout2, IconMoon, IconSun } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../../components';
import { selectLoggedUser } from '../../redux/selectors';
import { authService } from '../../services/auth';
import { toastService } from '../../services/toast';
import { getColorSchemeFromLocalStorage } from '../../utils';
import { SignInModal, SignUpModal } from './modals';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useMemo(() => location, [location]);

  const computedColorScheme = useComputedColorScheme(getColorSchemeFromLocalStorage());
  const { setColorScheme } = useMantineColorScheme();

  const loggedUser = useSelector(selectLoggedUser);

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [signInModalOpened, { open: openSignInModal, close: closeSignInModal }] = useDisclosure(false);
  const [signUpModalOpened, { open: openSignUpModal, close: closeSignUpModal }] = useDisclosure(false);
  const [signOutConfirmModalOpened, { open: openSignOutConfirmModal, close: closeSignOutConfirmModal }] =
    useDisclosure(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    setJwtToken(token);
  }, []);

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const signOut = () => {
    authService.signOut().finally(() => {
      closeSignOutConfirmModal();
      setJwtToken(null);
      navigate('/');
      toastService.success('Signed out successfully');
    });
  };

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
            {loggedUser ? (
              <Button
                variant={pathname.includes(loggedUser.username) ? 'light' : 'default'}
                color='indigo'
                px={10}
                radius='md'
                onClick={() => {
                  navigate(`account/${loggedUser.username}`);
                }}
              >
                <Avatar
                  key={loggedUser.username}
                  src={loggedUser.photo}
                  name={loggedUser.username}
                  color='initials'
                  size={24}
                >
                  {loggedUser.username[0].toUpperCase()}
                </Avatar>
                <Text className='ms-1.5 text-sm'>{loggedUser.username}</Text>
              </Button>
            ) : (
              <Button onClick={openSignInModal} color='cyan' variant='light' loading={!!jwtToken}>
                Sign In
              </Button>
            )}

            <Tooltip withArrow label={computedColorScheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <ActionIcon variant='default' radius='md' size={36} onClick={toggleColorScheme} aria-label='Toggle theme'>
                {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>

            {loggedUser && (
              <Tooltip withArrow label='Sign Out'>
                <ActionIcon
                  variant='light'
                  radius={'md'}
                  size={36}
                  color='red'
                  onClick={openSignOutConfirmModal}
                  aria-label='Sign Out'
                >
                  <IconLogout2 size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </div>
        </div>
      </header>

      <SignInModal opened={signInModalOpened} close={closeSignInModal} openSignUpModal={openSignUpModal} />
      <SignUpModal opened={signUpModalOpened} close={closeSignUpModal} openSignInModal={openSignInModal} />
      <ConfirmModal
        title='Sign Out'
        message='Are you sure you want to sign out?'
        opened={signOutConfirmModalOpened}
        confirm={signOut}
        close={closeSignOutConfirmModal}
      />
    </>
  );
};
