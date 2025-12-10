import { ActionIcon, Button, Popover, Tooltip } from '@mantine/core';
import { IconArrowsSort, IconChevronDown, IconChevronUp, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { FilterCriteria, FiltersState } from '../types';

interface FiltersProps {
  disabled?: boolean;
  filters: FiltersState;
  onFiltersChange: (criteria: FilterCriteria) => void;
  onReset: () => void;
}

export const Filters = ({ disabled, filters, onFiltersChange, onReset }: FiltersProps) => {
  const { t } = useTranslation();

  const isDefaultFilters = filters.criteria === FilterCriteria.Date && filters.isAscending;

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
              disabled={disabled}
              size={42}
              color='teal'
              radius='md'
              aria-label={t('components.filters.title')}
            >
              <IconArrowsSort size={20} />
            </ActionIcon>
          </Tooltip>
        </Popover.Target>

        {!isDefaultFilters && (
          <ActionIcon
            className='absolute -right-1 -top-1 rounded-full'
            disabled={disabled}
            size={16}
            color='gray'
            onClick={onReset}
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
            onClick={() => onFiltersChange(label)}
          >
            <span className='me-0.5'>{t(`components.filters.${label}`)}</span>

            {filters.criteria === label &&
              (filters.isAscending ? (
                <IconChevronDown size={18} color='violet' />
              ) : (
                <IconChevronUp size={18} color='violet' />
              ))}
          </Button>
        ))}
      </Popover.Dropdown>
    </Popover>
  );
};
