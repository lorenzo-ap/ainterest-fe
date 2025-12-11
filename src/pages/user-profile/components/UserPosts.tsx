import { useTranslation } from 'react-i18next';
import { Filters, RenderPosts } from '../../../components';
import { usePostsFiltering } from '../../../hooks';
import { useUserByUsername, useUserPosts } from '../../../queries';
import { SearchPostsInput } from '../../components';

type UserPostsProps = {
  username: string;
};

export const UserPosts = ({ username }: UserPostsProps) => {
  const { t } = useTranslation();

  const { data: user } = useUserByUsername(username);
  const { data: userPosts } = useUserPosts(user._id);

  const { searchText, handleSearchChange, resetSearch, filters, handleFiltersChange, resetFilters, filteredPosts } =
    usePostsFiltering(userPosts);

  return (
    <>
      {!!userPosts.length && (
        <div className='mt-4 flex items-end gap-x-2 md:mt-7'>
          <SearchPostsInput
            placeholder={t('pages.components.search_posts_input.enter_prompt')}
            loading={false}
            searchText={searchText}
            handleSearchChange={handleSearchChange}
            resetSearch={resetSearch}
          />

          <Filters filters={filters} onFiltersChange={handleFiltersChange} onReset={resetFilters} />
        </div>
      )}

      <RenderPosts posts={filteredPosts} searchText={searchText} loading={false} />
    </>
  );
};
