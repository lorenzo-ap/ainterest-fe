import { CloseButton, TextInput, Tooltip } from '@mantine/core';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchPostsInputProps {
  placeholder: string;
  loading: boolean;
  searchText: string;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  resetSearch: () => void;
}

export const SearchPostsInput = (props: SearchPostsInputProps) => {
  const { t } = useTranslation();

  return (
    <TextInput
      flex={1}
      size='md'
      radius='md'
      type='text'
      inputMode='text'
      name='post-search'
      autoComplete='off'
      label={t('pages.components.search_posts_input.search_posts')}
      aria-label={t('pages.components.search_posts_input.search_posts')}
      placeholder={props.placeholder}
      disabled={props.loading}
      value={props.searchText}
      onChange={props.handleSearchChange}
      rightSection={
        props.searchText && (
          <Tooltip withArrow label={t('a11y.clear')}>
            <CloseButton onClick={props.resetSearch} />
          </Tooltip>
        )
      }
    />
  );
};
