import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ActionIcon, Button, CloseButton, TextInput, Tooltip } from '@mantine/core';
import { IconPhotoAi, IconRefresh } from '@tabler/icons-react';

import { Post } from '../../types/post.interface';
import useFetchPosts from '../../hooks/useFetchPosts';
import { RootState } from '../../redux/store';
import RenderCards from './components/RenderCards';

const Home = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);

  const { isLoading, fetchPosts } = useFetchPosts();

  const posts = useSelector((state: RootState) => state.posts.posts);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value.trim()) {
      setSearchText('');
      return;
    }

    setSearchText(value);

    const searchResults = posts.filter(
      (post) =>
        post.name.toLowerCase().includes(value.trim().toLowerCase()) ||
        post.prompt.toLowerCase().includes(value.trim().toLowerCase())
    );

    setSearchedPosts(searchResults);
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div className='flex md:flex-row gap-5 flex-col justify-between items-start'>
        <div>
          <h1 className='font-extrabold text-[#222328] text-[32px]'>The Community Showcase</h1>

          <p className='mt-2 text-[#666E75] text-[16px] max-w-[500px]'>
            Browse through a collection of imaginative and visually stunning images generated by AI
          </p>
        </div>

        <Button component={Link} to='/create-post' color='violet' size='lg' rightSection={<IconPhotoAi size={20} />}>
          Create image
        </Button>
      </div>

      <div className='mt-8 md:mt-16 flex items-end gap-x-2'>
        <TextInput
          flex={1}
          size='md'
          radius='md'
          label='Search posts'
          placeholder='Enter name or prompt'
          value={searchText}
          onChange={handleSearchChange}
          rightSection={searchText && <CloseButton onClick={() => setSearchText('')} />}
        />

        <Tooltip label='Refresh posts' withArrow>
          <ActionIcon
            size={42}
            color='violet'
            radius='md'
            onClick={fetchPosts}
            disabled={isLoading}
            aria-label='Refresh'
          >
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
      </div>

      <div className='mt-5'>
        {searchText && (
          <h2 className='font-medium text-[#666E75] text-xl mb-3'>
            Showing results for <span className='text-[#222328]'>{searchText}</span>
          </h2>
        )}

        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
          {searchText ? (
            <RenderCards posts={searchedPosts} title='No search results found' isLoading={isLoading} />
          ) : (
            <RenderCards posts={posts} title='No posts found' isLoading={isLoading} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
