import { useDisclosure } from '@mantine/hooks';
import { Button, Modal } from '@mantine/core';

import { Link } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';

const Header = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-5 border-b border-b-[#E6EBF4]'>
      <div className='w-full max-w-7xl mx-auto flex justify-between items-center'>
        <Link to='/'>
          <span className='text-2xl font-semibold'>
            <span className='text-[#6469FF] font-bold'>AI</span>mage Generator
          </span>
        </Link>

        <Button variant='filled' size='md' rightSection={<IconUser size={18} />} onClick={open}>
          Sign up
        </Button>
      </div>

      <Modal opened={opened} onClose={close} title='Authentication'>
        {/* Modal content */}
      </Modal>
    </header>
  );
};

export default Header;
