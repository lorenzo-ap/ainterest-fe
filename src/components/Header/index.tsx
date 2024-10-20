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
    <header className={`${styles.header} w-full flex justify-between items-center sm:px-8 px-4 py-5 border-b`}>
      <div className='w-full max-w-7xl mx-auto flex justify-between items-center'>
        <Link to='/'>
          <Text className='text-2xl font-semibold'>
            <Text className='font-bold text-2xl' c='violet' span>
              AI
            </Text>
            mage Generator
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
