import { Skeleton, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { PostCard } from '.';
import { Post } from '../types';

const PostSkeleton = () => {
  return (
    <div className='border-color card flex aspect-square flex-col rounded-xl border p-4'>
      <Skeleton radius='md' className='mb-4 flex-grow' />
      <Skeleton radius='md' height={24} className='w-3/4' />
    </div>
  );
};

interface RenderPostsProps {
  posts: Post[];
  title: string;
  loading: boolean;
}

export const RenderPosts = (props: RenderPostsProps) => {
  const [displayedPosts, setDisplayedPosts] = useState(props.posts.slice(0, 100));

  useEffect(() => {
    setDisplayedPosts(props.posts.slice(0, 100));
  }, [props.posts]);

  const handleScroll = () => {
    if (Math.ceil(window.innerHeight + document.documentElement.scrollTop) >= document.documentElement.offsetHeight) {
      loadMoreData();
    }
  };

  const loadMoreData = () => {
    if (props.posts.length > displayedPosts.length) {
      setDisplayedPosts((prev) => [...prev, ...props.posts.slice(prev.length, prev.length + 10)]);
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
      {props.loading && Array.from({ length: 10 }).map((_, index) => <PostSkeleton key={index} />)}

      {displayedPosts.length ? (
        displayedPosts.map((post) => <PostCard key={post._id} {...post} />)
      ) : (
        <Title className='col-span-full uppercase' order={2} c='violet'>
          {props.title}
        </Title>
      )}
    </div>
  );
};
