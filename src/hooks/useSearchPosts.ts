import { useState } from 'react';
import { Post } from '../types';

export const useSearchPosts = (posts: Post[], includeUsername?: boolean) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);

  const resetSearch = () => {
    setSearchText('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value.trim()) {
      setSearchText('');
      return;
    }

    setSearchText(value);

    const searchResults = posts.filter(
      (post) =>
        post.prompt.toLowerCase().includes(value.trim().toLowerCase()) ||
        (includeUsername && post.user.username.toLowerCase().includes(value.trim().toLowerCase()))
    );
    setSearchedPosts(searchResults);
  };

  return { searchText, searchedPosts, handleSearchChange, resetSearch };
};
