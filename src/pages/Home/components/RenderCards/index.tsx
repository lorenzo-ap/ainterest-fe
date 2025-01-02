import { Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Card } from '../../../../components';
import CardSkeleton from '../../../../components/Card/components/CardSkeleton';
import { Post } from '../../../../types/post.interface';

interface RenderCardsProps {
  posts: Post[];
  title: string;
  isLoading: boolean;
}

const RenderCards = ({ posts: data, title, isLoading }: RenderCardsProps) => {
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

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 10 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </>
    );
  }

  if (displayedPosts.length) {
    return displayedPosts.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <Title className='uppercase text-[#6469FF]' order={2} size={'h3'}>
      {title}
    </Title>
  );
};

export default RenderCards;
