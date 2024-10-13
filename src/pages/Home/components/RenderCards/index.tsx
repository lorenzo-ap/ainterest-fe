import { useEffect, useState } from 'react';

import { Card } from '../../../../components';
import { Post } from '../../../../types/post.interface';
import CardSkeleton from '../../../../components/Card/components/CardSkeleton';

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
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
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

  return <h2 className='mt-5 font-bold text-[#6469FF] text-xl uppercase'>{title}</h2>;
};

export default RenderCards;
