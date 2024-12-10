import { ActionIcon, Text, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { getColorSchemeFromLocalStorage } from '../../utils';
import styles from './index.module.scss';

const Header = () => {
  const { setColorScheme } = useMantineColorScheme();

  const computedColorScheme = useComputedColorScheme(getColorSchemeFromLocalStorage());

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    document.body.style.background =
      computedColorScheme === 'dark' ? 'var(--mantine-color-gray-0)' : 'var(--mantine-color-dark-7)';
    document.body.style.color =
      computedColorScheme === 'dark' ? 'var(--mantine-color-black)' : 'var(--mantine-color-dark-0)';
  };

  return (
    <header className={`${styles.header} flex w-full items-center justify-between border-b px-4 py-5 sm:px-8`}>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between'>
        <Link to='/'>
          <Text className='group text-2xl font-semibold transition-colors duration-150 hover:text-violet-200'>
            <Text className='text-2xl font-bold' c='violet' span>
              AI
            </Text>
            nterest
          </Text>
        </Link>

        <Tooltip withArrow label={computedColorScheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <ActionIcon variant='default' radius={'md'} size={36} onClick={toggleColorScheme} aria-label='Toggle theme'>
            {computedColorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
