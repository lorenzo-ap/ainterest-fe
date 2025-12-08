import { ActionIcon, Avatar, Button, Popover, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconLogout2, IconMoon, IconSun, IconWorld } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ConfirmModal } from '../../components';
import { useCurrentUser, useSignOut } from '../../queries';
import { toastService } from '../../services/toast';
import { Language } from '../../types';
import { SignInModal, SignUpModal } from './modals';

interface LanguageButtonProps {
  language: Language;
  label: string;
  action: () => void;
}

const LanguageButton = (props: LanguageButtonProps) => {
  const { i18n } = useTranslation();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Button
      className={`flex w-full items-center border-none ${props.language === Language.EN ? 'rounded-b-none' : 'rounded-t-none'} ${i18n.language === props.language && colorScheme === 'dark' ? 'bg-[#383838]' : ''}`}
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
  const { setColorScheme, colorScheme } = useMantineColorScheme();
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

  const changeLang = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('lang', newLanguage);
  };

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <meta content={colorScheme === 'dark' ? '#2e2e2e' : '#fff'} name='theme-color' />

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
              <Button
                component={Link}
                variant={pathname.includes(currentUser.username) ? 'light' : 'default'}
                color='indigo'
                radius='md'
                to={`account/${currentUser.username}`}
                className='px-[5px] xs:px-2.5'
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

                <Text className='ms-1.5 text-sm max-xs:hidden'>{currentUser.username}</Text>
              </Button>
            ) : (
              <Button disabled={isCurrentUserLoading} onClick={openSignInModal} color='violet' variant='light'>
                {t('common.sign_in')}
              </Button>
            )}

            <Popover position='bottom' withArrow arrowSize={10} arrowOffset={16} width={120} shadow='md'>
              <Popover.Target>
                <ActionIcon variant='default' radius='md' size={36} aria-label={t('a11y.change_language')}>
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
                colorScheme === 'dark'
                  ? 'pages.components.header.switch_to_light_mode'
                  : 'pages.components.header.switch_to_dark_mode'
              )}
            >
              <ActionIcon
                variant='default'
                radius='md'
                size={36}
                onClick={toggleColorScheme}
                aria-label={t(
                  colorScheme === 'dark'
                    ? 'pages.components.header.switch_to_light_mode'
                    : 'pages.components.header.switch_to_dark_mode'
                )}
              >
                {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>

            {currentUser && (
              <Tooltip withArrow label={t('pages.components.header.sign_out')}>
                <ActionIcon
                  variant='light'
                  radius={'md'}
                  size={36}
                  color='red'
                  onClick={openSignOutConfirmModal}
                  aria-label={t('pages.components.header.sign_out')}
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
        isLoading={isPending}
        opened={signOutConfirmModalOpened}
        confirm={signOut}
        close={closeSignOutConfirmModal}
      />
    </>
  );
};
