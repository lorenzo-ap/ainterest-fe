import { ActionIcon, Button, Popover, Tooltip } from '@mantine/core';
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { IconArrowsSort, IconChevronDown, IconChevronUp, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useFilterPosts } from '../hooks';
import { FilterCriteria, FiltersState, Post } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SelectorType<T> = (state: any) => T;

interface FiltersProps {
  disabled?: boolean;
  postsSelector: SelectorType<Post[]>;
  filtersStateSelector: SelectorType<FiltersState>;
  setFiltersState: ActionCreatorWithPayload<FiltersState>;
  setPosts: ActionCreatorWithPayload<Post[]>;
  resetFilters: ActionCreatorWithoutPayload;
}

export const Filters = (props: FiltersProps) => {
  const { t } = useTranslation();
  const { activeFiltersCriteria, isAscending, handleFiltersChange, resetFilteredPosts } = useFilterPosts(
    props.postsSelector,
    props.setPosts,
    props.filtersStateSelector,
    props.setFiltersState,
    props.resetFilters
  );

  return (
    <Popover
      position='bottom-end'
      withArrow
      arrowSize={10}
      arrowOffset={16}
      width={110}
      arrowPosition='side'
      shadow='md'
    >
      <div className='relative'>
        <Popover.Target>
          <Tooltip label={t('components.filters.title')} withArrow>
            <ActionIcon
              disabled={props.disabled}
              size={42}
              color='teal'
              radius='md'
              aria-label={t('components.filters.title')}
            >
              <IconArrowsSort size={20} />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>

        {(!isAscending ? true : activeFiltersCriteria !== FilterCriteria.Date) && (
          <ActionIcon
            className='absolute -right-1 -top-1 rounded-full'
            disabled={props.disabled}
            size={16}
            color='gray'
            onClick={resetFilteredPosts}
            aria-label={t('a11y.reset_filters')}
          >
            <IconX size={12} />
          </ActionIcon>
        )}
      </div>

      <Popover.Dropdown className='flex flex-col items-start p-0'>
        {Object.values(FilterCriteria).map((label) => (
          <Button
            key={label}
            className={`flex w-full items-center border-x-0 px-4 ${
              label === FilterCriteria.Date
                ? 'rounded-b-none border-none'
                : label === FilterCriteria.Likes
                  ? 'rounded-t-none border-none'
                  : 'rounded-none'
            }`}
            variant='default'
            onClick={() => handleFiltersChange(label)}
          >
            <span className='me-0.5'>{t(`components.filters.${label}`)}</span>

            {activeFiltersCriteria === label &&
              (isAscending ? <IconChevronDown size={18} color='violet' /> : <IconChevronUp size={18} color='violet' />)}
          </Button>
        ))}
      </Popover.Dropdown>
    </Popover>
  );
};
