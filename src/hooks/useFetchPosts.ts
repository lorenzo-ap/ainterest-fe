import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { postService } from '../services/post';

const useFetchPosts = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const posts = useSelector((state: RootState) => state.posts);

  const fetchPosts = useCallback(() => {
    setIsLoading(true);

    postService
      .getPosts()
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (posts.length) return;

    fetchPosts();
  }, [posts.length, fetchPosts]);

  return { isLoading, fetchPosts };
};

export default useFetchPosts;
