import { Menu, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HelpIcon, Initials, KeyIcon, MoonIcon, SignOutIcon, SunIcon, UserIcon } from '../../components/ui';
import { routes } from '../../constants';
import { useOnboarding } from '../../providers';
import { useCurrentUser } from '../../queries';
import { Language } from '../../types';
import { PasskeysModal, SignOutModal } from './modals';

type ChoiceProps = {
	options: { value: string; label: string; icon?: ReactNode }[];
	value: string;
	onChange: (value: string) => void;
};

/** A row of mutually exclusive choices — used for appearance and language alike. */
const Choice = ({ options, value, onChange }: ChoiceProps) => (
	<div className='flex gap-1.5 px-2.5 pt-1 pb-2'>
		{options.map((option) => (
			<button
				className='pill h-8 flex-1 justify-center'
				data-active={value === option.value}
				key={option.value}
				onClick={() => onChange(option.value)}
				type='button'
			>
				{option.icon}
				{option.label}
			</button>
		))}
	</div>
);

type UserMenuProps = {
	onSignIn: () => void;
};

export const UserMenu = ({ onSignIn }: UserMenuProps) => {
	const { t, i18n } = useTranslation();
	const { colorScheme, setColorScheme } = useMantineColorScheme();

	const { data: currentUser } = useCurrentUser();
	const { open: openOnboarding } = useOnboarding();

	const [passkeysModalOpened, { open: openPasskeysModal, close: closePasskeysModal }] = useDisclosure(false);
	const [signOutModalOpened, { open: openSignOutModal, close: closeSignOutModal }] = useDisclosure(false);

	const changeLang = (newLanguage: string) => {
		i18n.changeLanguage(newLanguage);
		localStorage.setItem('lang', newLanguage);
	};

	return (
		<>
			<Menu closeOnItemClick={false} position='bottom-end' shadow='lg' width={248}>
				<Menu.Target>
					{currentUser ? (
						<button
							aria-label={t('a11y.profile')}
							className='rounded-full transition-opacity duration-150 hover:opacity-75'
							type='button'
						>
							<Initials name={currentUser.username} size={32} src={currentUser.photo} />
						</button>
					) : (
						<button aria-label={t('pages.components.header.settings')} className='icon-btn h-9 w-9' type='button'>
							<UserIcon size={19} />
						</button>
					)}
				</Menu.Target>

				<Menu.Dropdown>
					{currentUser && (
						<>
							<div className='flex items-center gap-3 px-2.5 pt-2.5 pb-3'>
								<Initials name={currentUser.username} size={36} src={currentUser.photo} />
								<div className='min-w-0'>
									<p className='truncate font-medium text-[14px] text-ink leading-tight'>{currentUser.username}</p>
									<p className='mt-0.5 truncate text-[12px] text-ink-3'>{currentUser.email}</p>
								</div>
							</div>

							<Menu.Divider />

							<Menu.Item
								closeMenuOnClick={true}
								component={Link}
								leftSection={<UserIcon size={17} />}
								to={routes.profile(currentUser.username)}
							>
								{t('pages.components.header.your_profile')}
							</Menu.Item>

							<Menu.Item closeMenuOnClick={true} leftSection={<HelpIcon size={17} />} onClick={openOnboarding}>
								{t('components.onboarding.menu_entry')}
							</Menu.Item>

							<Menu.Item closeMenuOnClick={true} leftSection={<KeyIcon size={17} />} onClick={openPasskeysModal}>
								{t('pages.components.modals.passkeys.title')}
							</Menu.Item>

							<Menu.Divider />
						</>
					)}

					<Menu.Label>{t('pages.components.header.appearance')}</Menu.Label>
					<Choice
						onChange={(value) => setColorScheme(value as 'light' | 'dark')}
						options={[
							{ value: 'light', label: t('pages.components.header.light'), icon: <SunIcon size={15} /> },
							{ value: 'dark', label: t('pages.components.header.dark'), icon: <MoonIcon size={15} /> }
						]}
						value={colorScheme === 'dark' ? 'dark' : 'light'}
					/>

					<Menu.Label>{t('pages.components.header.language')}</Menu.Label>
					<Choice
						onChange={changeLang}
						options={Object.values(Language).map((lang) => ({
							value: lang,
							label: t(`common.languages.${lang}`)
						}))}
						value={i18n.language}
					/>

					{currentUser ? (
						<>
							<Menu.Divider />

							<Menu.Item
								closeMenuOnClick={true}
								color='red'
								leftSection={<SignOutIcon size={17} />}
								onClick={openSignOutModal}
							>
								{t('pages.components.header.sign_out')}
							</Menu.Item>
						</>
					) : (
						<>
							<Menu.Divider />

							<Menu.Item closeMenuOnClick={true} leftSection={<UserIcon size={17} />} onClick={onSignIn}>
								{t('common.sign_in')}
							</Menu.Item>
						</>
					)}
				</Menu.Dropdown>
			</Menu>

			<PasskeysModal onClose={closePasskeysModal} opened={passkeysModalOpened} />
			<SignOutModal onClose={closeSignOutModal} opened={signOutModalOpened} />
		</>
	);
};
