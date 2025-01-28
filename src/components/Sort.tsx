import { ActionIcon, Button, Popover, Tooltip } from '@mantine/core';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { IconArrowsSort, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { store } from '../redux';
import { Post, SortCriteria } from '../types';

interface SortPopoverProps {
  posts: Post[];
  setPosts: ActionCreatorWithPayload<Post[]>;
}

export const Sort = (props: SortPopoverProps) => {
  const [activeSortCriteria, setActiveSortCriteria] = useState<SortCriteria>(SortCriteria.Date);
  const [isAscending, setIsAscending] = useState(true);

  const sort = (criteria: SortCriteria) => {
    const newIsAscending = activeSortCriteria === criteria ? !isAscending : true;

    setActiveSortCriteria(criteria);
    setIsAscending(newIsAscending);

    sortPosts(criteria, newIsAscending);
  };

  const sortPosts = (criteria: SortCriteria, ascending: boolean) => {
    const sortedPosts = [...props.posts].sort((a, b) => {
      let comparison = 0;

      switch (criteria) {
        case SortCriteria.Date:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case SortCriteria.Name:
          comparison = a.prompt.localeCompare(b.prompt);
          break;
        case SortCriteria.Likes:
          comparison = b.likes.length - a.likes.length;
          break;
      }

      return ascending ? comparison : -comparison;
    });

    store.dispatch(props.setPosts(sortedPosts));
  };

  useEffect(() => {
    return () => {
      sortPosts(SortCriteria.Date, isAscending);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Popover
      position='bottom-end'
      withArrow
      arrowSize={10}
      arrowOffset={16}
      width={93}
      arrowPosition='side'
      shadow='md'
    >
      <Popover.Target>
        <Tooltip label='Sort' withArrow>
          <ActionIcon size={42} color='teal' radius='md' aria-label='Sort' loading={!props.posts.length}>
            <IconArrowsSort size={20} />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>

      <Popover.Dropdown className='flex flex-col items-start p-0'>
        {Object.values(SortCriteria).map((label) => (
          <Button
            key={label}
            className={`flex w-full items-center px-4 py-3 ${
              label === SortCriteria.Date
                ? 'rounded-b-none border-none'
                : label === SortCriteria.Likes
                  ? 'rounded-t-none border-none'
                  : 'rounded-none'
            }`}
            variant='default'
            onClick={() => sort(label)}
          >
            <span className='me-0.5'>{label}</span>

            {activeSortCriteria === label &&
              (isAscending ? <IconChevronDown size={18} color='violet' /> : <IconChevronUp size={18} color='violet' />)}
          </Button>
        ))}
      </Popover.Dropdown>
    </Popover>
  );
};
