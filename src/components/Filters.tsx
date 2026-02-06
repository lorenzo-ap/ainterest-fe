import { ActionIcon, Button, Popover, Tooltip } from '@mantine/core';
import { IconArrowsSort, IconChevronDown, IconChevronUp, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { type FiltersState, SortCriteria, SortOrder } from '../types';

const roundedClassMap: Partial<Record<SortCriteria, string>> = {
	[SortCriteria.DATE]: 'rounded-b-none border-none',
	[SortCriteria.LIKES]: 'rounded-t-none border-none'
};

type FiltersProps = {
	disabled?: boolean;
	filters: FiltersState;
	onFiltersChange: (criteria: SortCriteria) => void;
	onReset: () => void;
};

export const Filters = ({ disabled, filters, onFiltersChange, onReset }: FiltersProps) => {
	const { t } = useTranslation();

	const isDefaultFilters = filters.criteria === SortCriteria.DATE && filters.order === SortOrder.ASCENDING;

	return (
		<Popover
			arrowOffset={16}
			arrowPosition='side'
			arrowSize={10}
			position='bottom-end'
			shadow='md'
			width={110}
			withArrow
		>
			<div className='relative'>
				<Popover.Target>
					<Tooltip label={t('components.filters.title')} withArrow>
						<ActionIcon
							aria-label={t('components.filters.title')}
							color='teal'
							disabled={disabled}
							radius='md'
							size={42}
						>
							<IconArrowsSort size={20} />
						</ActionIcon>
					</Tooltip>
				</Popover.Target>

				{!isDefaultFilters && (
					<ActionIcon
						aria-label={t('a11y.reset_filters')}
						className='absolute -top-1 -right-1 rounded-full'
						color='gray'
						disabled={disabled}
						onClick={onReset}
						size={16}
					>
						<IconX size={12} />
					</ActionIcon>
				)}
			</div>

			<Popover.Dropdown className='flex flex-col items-start p-0'>
				{Object.values(SortCriteria).map((label) => (
					<Button
						className={`flex w-full items-center border-x-0 px-4 ${roundedClassMap[label] ?? 'rounded-none'}`}
						key={label}
						onClick={() => onFiltersChange(label)}
						variant='default'
					>
						<span className='me-0.5'>{t(`components.filters.${label}`)}</span>

						{filters.criteria === label &&
							(filters.order === SortOrder.ASCENDING ? (
								<IconChevronDown color='violet' size={18} />
							) : (
								<IconChevronUp color='violet' size={18} />
							))}
					</Button>
				))}
			</Popover.Dropdown>
		</Popover>
	);
};
