import { ActionIcon, Tooltip } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <Tooltip label='Scroll to top' withArrow position='left'>
          <ActionIcon
            size={42}
            color='violet'
            radius='md'
            onClick={scrollToTop}
            aria-label='Scroll to top'
            className='shadow-lg transition-shadow hover:shadow-xl'
          >
            <IconArrowUp size={18} />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
};
