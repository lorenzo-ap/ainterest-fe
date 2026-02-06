import { ActionIcon, Menu, useMantineColorScheme } from '@mantine/core';
import { IconLogout, IconMenu2, IconMoon, IconSunHigh, IconWorld, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../queries';
import { Language } from '../../types';

type HeaderMenuProps = {
	openSignOutConfirmModal: () => void;
};

export const HeaderMenu = ({ openSignOutConfirmModal }: HeaderMenuProps) => {
	const { t, i18n } = useTranslation();
	const { colorScheme, setColorScheme } = useMantineColorScheme();
	const [menuOpened, setMenuOpened] = useState(false);

	const { data: currentUser } = useCurrentUser();

	const changeLang = (newLanguage: Language) => {
		i18n.changeLanguage(newLanguage);
		localStorage.setItem('lang', newLanguage);
	};

	const toggleColorScheme = () => {
		setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
	};

	return (
		<Menu
			arrowOffset={16}
			arrowSize={10}
			closeOnItemClick={false}
			onChange={setMenuOpened}
			opened={menuOpened}
			position='bottom-end'
			shadow='md'
			withArrow
		>
			<Menu.Target>
				<ActionIcon radius='md' size={36} variant='default'>
					<span className={`transition-transform duration-200 ease-in-out ${menuOpened ? 'rotate-90' : 'rotate-0'}`}>
						{menuOpened ? <IconX size={18} /> : <IconMenu2 size={18} />}
					</span>
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>{t('common.language')}</Menu.Label>
				<Menu.Item
					disabled={i18n.language === Language.EN}
					leftSection={<IconWorld size={16} />}
					onClick={() => changeLang(Language.EN)}
				>
					{t('common.languages.en')}
				</Menu.Item>
				<Menu.Item
					disabled={i18n.language === Language.RO}
					leftSection={<IconWorld size={16} />}
					onClick={() => changeLang(Language.RO)}
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
							closeMenuOnClick={true}
							color='red'
							leftSection={<IconLogout size={16} />}
							onClick={openSignOutConfirmModal}
						>
							{t('pages.components.header.sign_out')}
						</Menu.Item>
					</>
				)}
			</Menu.Dropdown>
		</Menu>
	);
};
