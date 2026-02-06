import { CloseButton, TextInput, Tooltip } from '@mantine/core';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

type SearchPostsInputProps = {
	placeholder: string;
	loading: boolean;
	searchText: string;
	handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
	resetSearch: () => void;
};

export const SearchPostsInput = (props: SearchPostsInputProps) => {
	const { t } = useTranslation();

	return (
		<TextInput
			aria-label={t('pages.components.search_posts_input.search_posts')}
			autoComplete='off'
			disabled={props.loading}
			flex={1}
			inputMode='text'
			label={t('pages.components.search_posts_input.search_posts')}
			name='post-search'
			onChange={props.handleSearchChange}
			placeholder={props.placeholder}
			radius='md'
			rightSection={
				props.searchText && (
					<Tooltip label={t('a11y.clear')} withArrow>
						<CloseButton onClick={props.resetSearch} />
					</Tooltip>
				)
			}
			size='md'
			type='text'
			value={props.searchText}
		/>
	);
};
