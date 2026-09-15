import { Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { type ChangeEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type FiltersState, SortCriteria, SortOrder } from '../types';
import { ArrowUpIcon, CheckIcon, CloseIcon, RefreshIcon, SearchIcon, SortIcon } from './ui';

const SORT_OPTIONS: SortCriteria[] = [SortCriteria.DATE, SortCriteria.LIKES, SortCriteria.NAME];

type DiscoveryBarProps = {
	placeholder: string;
	searchText: string;
	onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onResetSearch: () => void;
	filters: FiltersState;
	onFiltersChange: (criteria: SortCriteria) => void;
	onResetFilters: () => void;
	count: number;
	onRefresh?: () => void;
	refreshing?: boolean;
};

/**
 * Search and sorting as part of browsing, not as a form toolbar bolted on top.
 * Desktop keeps every control in reach; a phone gets one line and a sheet.
 */
export const DiscoveryBar = (props: DiscoveryBarProps) => {
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement>(null);
	const isMobile = useMediaQuery('(max-width: 767px)');
	const [sheetOpened, { open: openSheet, close: closeSheet }] = useDisclosure(false);

	const isDefaultSort = props.filters.criteria === SortCriteria.DATE && props.filters.order === SortOrder.ASCENDING;
	const ascending = props.filters.order === SortOrder.ASCENDING;

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== '/' || event.metaKey || event.ctrlKey) return;

			const target = event.target as HTMLElement | null;
			if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

			event.preventDefault();
			inputRef.current?.focus();
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	const orderIcon = <ArrowUpIcon className={ascending ? 'rotate-180' : ''} size={14} />;

	const search = (
		<div className='group relative w-full lg:max-w-md'>
			<SearchIcon
				className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3 transition-colors group-focus-within:text-brand'
				size={17}
			/>

			<input
				aria-label={t('pages.components.search_posts_input.search_posts')}
				autoComplete='off'
				className='h-11 w-full rounded-full bg-inset pr-11 pl-11 text-[14px] text-ink outline-none ring-brand-tint-strong transition-all duration-200 placeholder:text-ink-3 focus:bg-transparent focus:ring-2 disabled:opacity-50'
				disabled={props.refreshing}
				name='post-search'
				onChange={props.onSearchChange}
				placeholder={props.placeholder}
				ref={inputRef}
				type='text'
				value={props.searchText}
			/>

			{props.searchText && (
				<button
					aria-label={t('a11y.clear')}
					className='icon-btn absolute top-1/2 right-2.5 h-7 w-7 -translate-y-1/2'
					onClick={props.onResetSearch}
					type='button'
				>
					<CloseIcon size={15} />
				</button>
			)}
		</div>
	);

	if (isMobile) {
		return (
			<>
				<div className='flex items-center gap-2'>
					{search}

					<button
						aria-label={t('components.filters.title')}
						className='pill h-11 w-11 shrink-0 justify-center px-0'
						data-active={!isDefaultSort}
						onClick={openSheet}
						type='button'
					>
						<SortIcon size={17} />
					</button>
				</div>

				<Drawer
					/* `size='auto'` alone still leaves a full-height flex-basis — release that too */
					classNames={{ content: 'rounded-t-xl bg-surface !h-auto !max-h-[85%] !flex-none', body: 'px-4 pb-8 pt-1' }}
					onClose={closeSheet}
					opened={sheetOpened}
					position='bottom'
					size='auto'
					withCloseButton={false}
				>
					<div className='mx-auto mb-5 h-1 w-9 rounded-full bg-line-strong' />

					<h3 className='eyebrow mb-3'>{t('components.filters.title')}</h3>

					<ul className='flex flex-col'>
						{SORT_OPTIONS.map((criteria) => {
							const active = props.filters.criteria === criteria;

							return (
								<li key={criteria}>
									<button
										className={`flex h-12 w-full items-center justify-between rounded-md px-3 text-[15px] transition-colors ${
											active ? 'text-brand' : 'text-ink-2'
										}`}
										onClick={() => props.onFiltersChange(criteria)}
										type='button'
									>
										{t(`components.discovery.sort.${criteria}`)}
										{active && (
											<span className='flex items-center gap-1.5'>
												{orderIcon}
												<CheckIcon size={16} />
											</span>
										)}
									</button>
								</li>
							);
						})}
					</ul>

					<div className='mt-3 flex items-center justify-between border-line border-t pt-4'>
						<span className='font-mono text-[11px] text-ink-3'>
							{t('components.discovery.count', { count: props.count })}
						</span>

						{!isDefaultSort && (
							<button
								className='text-[13px] text-ink-3 transition-colors hover:text-ink'
								onClick={props.onResetFilters}
								type='button'
							>
								{t('a11y.reset_filters')}
							</button>
						)}
					</div>
				</Drawer>
			</>
		);
	}

	return (
		<div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5'>
			{search}

			<div className='scrollbar-none flex items-center gap-2 overflow-x-auto'>
				{SORT_OPTIONS.map((criteria) => {
					const active = props.filters.criteria === criteria;

					return (
						<button
							className='pill'
							data-active={active}
							disabled={props.refreshing}
							key={criteria}
							onClick={() => props.onFiltersChange(criteria)}
							type='button'
						>
							{t(`components.discovery.sort.${criteria}`)}
							{active && orderIcon}
						</button>
					);
				})}

				{!isDefaultSort && (
					<button
						aria-label={t('a11y.reset_filters')}
						className='icon-btn h-8 w-8 shrink-0'
						onClick={props.onResetFilters}
						type='button'
					>
						<CloseIcon size={15} />
					</button>
				)}

				<div className='ml-auto flex shrink-0 items-center gap-3 ps-2'>
					<span className='whitespace-nowrap font-mono text-[11px] text-ink-3 tracking-wider'>
						{t('components.discovery.count', { count: props.count })}
					</span>

					{props.onRefresh && (
						<button
							aria-label={t('pages.home.refresh_posts')}
							className='icon-btn h-8 w-8 disabled:opacity-40'
							disabled={props.refreshing}
							onClick={props.onRefresh}
							type='button'
						>
							<RefreshIcon className={props.refreshing ? 'animate-spin' : ''} size={16} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
