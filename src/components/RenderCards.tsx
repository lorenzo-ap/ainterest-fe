import { Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Card, CardSkeleton } from '.';
import { Post } from '../types';

interface RenderCardsProps {
  posts: Post[];
  title: string;
  loading: boolean;
}

export const RenderCards = ({ posts: data, title, loading }: RenderCardsProps) => {
  const [displayedPosts, setDisplayedPosts] = useState(data.slice(0, 10));

  useEffect(() => {
    setDisplayedPosts(data.slice(0, 10));
  }, [data]);

  const handleScroll = () => {
    if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) >= document.documentElement.offsetHeight) {
      loadMoreData();
    }
  };

  const loadMoreData = () => {
    if (data.length > displayedPosts.length) {
      setDisplayedPosts((prev) => [...prev, ...data.slice(prev.length, prev.length + 10)]);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {loading && Array.from({ length: 10 }).map((_, index) => <CardSkeleton key={index} />)}

      {displayedPosts.length ? (
        displayedPosts.map((post) => <Card key={post._id} {...post} />)
      ) : (
        <Title className='col-span-full uppercase' order={2} c='violet'>
          {title}
        </Title>
      )}
    </div>
  );
};
