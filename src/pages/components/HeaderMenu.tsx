import { ActionIcon, Menu, useMantineColorScheme } from '@mantine/core';
import { IconLogout, IconMenu2, IconMoon, IconSunHigh, IconWorld } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../queries';
import { Language } from '../../types';

interface HeaderMenuProps {
  openSignOutConfirmModal: () => void;
}

export const HeaderMenu = ({ openSignOutConfirmModal }: HeaderMenuProps) => {
  const { t, i18n } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const { data: currentUser } = useCurrentUser();

  const changeLang = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('lang', newLanguage);
  };

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Menu position='bottom-end' withArrow arrowSize={10} arrowOffset={16} shadow='md' closeOnItemClick={false}>
      <Menu.Target>
        <ActionIcon variant='default' radius='md' size={36}>
          <IconMenu2 size={18} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('common.language')}</Menu.Label>
        <Menu.Item
          leftSection={<IconWorld size={16} />}
          onClick={() => changeLang(Language.EN)}
          disabled={i18n.language === Language.EN}
        >
          {t('common.languages.en')}
        </Menu.Item>
        <Menu.Item
          leftSection={<IconWorld size={16} />}
          onClick={() => changeLang(Language.RO)}
          disabled={i18n.language === Language.RO}
        >
          {t('common.languages.ro')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>{t('common.theme')}</Menu.Label>
        <Menu.Item
          leftSection={colorScheme === 'dark' ? <IconSunHigh size={16} /> : <IconMoon size={16} />}
          onClick={toggleColorScheme}
        >
          {colorScheme === 'dark'
            ? t('pages.components.header.switch_to_light_mode')
            : t('pages.components.header.switch_to_dark_mode')}
        </Menu.Item>

        {currentUser && (
          <>
            <Menu.Divider />
            <Menu.Item
              color='red'
              leftSection={<IconLogout size={16} />}
              onClick={openSignOutConfirmModal}
              closeMenuOnClick={true}
            >
              {t('pages.components.header.sign_out')}
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
