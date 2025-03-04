import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { postService } from '../services/posts';

export const useFetchPosts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const posts = useSelector((state: RootState) => state.posts.allPosts);

  const fetchPosts = useCallback(() => {
    if (posts.length) {
      setFirstLoad(false);
    }

    setLoading(true);

    postService.setPosts().finally(() => {
      setLoading(false);
      setFirstLoad(false);
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (posts.length) return;

    fetchPosts();
  }, [posts.length, fetchPosts]);

  return { fetchPosts, loading, firstLoad };
};
