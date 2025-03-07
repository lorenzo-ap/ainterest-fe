import {
  ActionIcon,
  Avatar,
  Button,
  Popover,
  Text,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconLogout2, IconMoon, IconSun, IconWorld } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../../components';
import { selectLoggedUser } from '../../redux/selectors';
import { authService } from '../../services/auth';
import { toastService } from '../../services/toast';
import { Language } from '../../types';
import { getColorSchemeFromLocalStorage } from '../../utils';
import { SignInModal, SignUpModal } from './modals';

interface LanguageButtonProps {
  language: Language;
  label: string;
  action: () => void;
}

const LanguageButton = (props: LanguageButtonProps) => {
  const { i18n } = useTranslation();

  return (
    <Button
      className={`flex w-full items-center border-none ${props.language === Language.EN ? 'rounded-b-none' : 'rounded-t-none'}`}
      variant='default'
      disabled={i18n.language === props.language}
      onClick={props.action}
    >
      <span className='me-0.5'>{props.label}</span>
      {i18n.language === props.language && <IconCheck size={14} />}
    </Button>
  );
};

export const Header = () => {
  const { t, i18n } = useTranslation();
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

  useEffect(() => {
    const lang = localStorage.getItem('lang');
    localStorage.setItem('lang', lang || 'en');
  }, []);

  const changeLang = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('lang', newLanguage);
  };

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const signOut = () => {
    authService.signOut().finally(() => {
      closeSignOutConfirmModal();
      setJwtToken(null);
      navigate('/');
      toastService.success(t('apis.auth.success_sign_out'));
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
                className='px-[5px] xs:px-2.5'
                variant={pathname.includes(loggedUser.username) ? 'light' : 'default'}
                color='indigo'
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

                <Text className='ms-1.5 text-sm max-xs:hidden'>{loggedUser.username}</Text>
              </Button>
            ) : (
              <Button onClick={openSignInModal} color='cyan' variant='light' loading={!!jwtToken}>
                {t('common.sign_in')}
              </Button>
            )}

            <Popover position='bottom' withArrow arrowSize={10} arrowOffset={16} width={120} shadow='md'>
              <Popover.Target>
                <ActionIcon variant='default' radius='md' size={36} aria-label='Change Language'>
                  <IconWorld size={18} stroke={1.5} />
                </ActionIcon>
              </Popover.Target>

              <Popover.Dropdown className='flex flex-col items-start p-0'>
                <LanguageButton
                  language={Language.EN}
                  label={t('common.languages.en')}
                  action={() => changeLang(Language.EN)}
                />
                <LanguageButton
                  language={Language.RO}
                  label={t('common.languages.ro')}
                  action={() => changeLang(Language.RO)}
                />
              </Popover.Dropdown>
            </Popover>

            <Tooltip
              withArrow
              label={t(
                computedColorScheme === 'dark'
                  ? 'pages.components.header.switch_to_light_mode'
                  : 'pages.components.header.switch_to_dark_mode'
              )}
            >
              <ActionIcon variant='default' radius='md' size={36} onClick={toggleColorScheme} aria-label='Toggle theme'>
                {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>

            {loggedUser && (
              <Tooltip withArrow label={t('pages.components.header.sign_out')}>
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
        title={t('pages.components.header.sign_out')}
        message={t('pages.components.header.are_you_sure')}
        opened={signOutConfirmModalOpened}
        confirm={signOut}
        close={closeSignOutConfirmModal}
      />
    </>
  );
};
