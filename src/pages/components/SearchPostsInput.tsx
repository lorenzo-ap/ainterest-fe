import { CloseButton, TextInput, Tooltip } from '@mantine/core';

interface SearchPostsInputProps {
  placeholder: string;
  loading: boolean;
  searchText: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetSearch: () => void;
}

export const SearchPostsInput = (props: SearchPostsInputProps) => {
  return (
    <TextInput
      flex={1}
      size='md'
      radius='md'
      type='text'
      inputMode='text'
      name='post-search'
      role='search'
      autoComplete='off'
      label='Search posts'
      placeholder={props.placeholder}
      disabled={props.loading}
      value={props.searchText}
      onChange={props.handleSearchChange}
      rightSection={
        props.searchText && (
          <Tooltip withArrow label='Clear'>
            <CloseButton onClick={props.resetSearch} />
          </Tooltip>
        )
      }
    />
  );
};
