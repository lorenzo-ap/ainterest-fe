import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../types/post.interface';
import { setPosts } from '../redux/slices/postsSlice';
import { AppDispatch, RootState } from '../redux/store';

export interface PostAPIResponse<T> {
  success: boolean;
  data: T;
}

const useFetchPosts = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const fetchPosts = () => {
    setIsLoading(true);

    axios
      .get<PostAPIResponse<Post[]>>(`${import.meta.env.VITE_API_URL}/api/v1/post`)
      .then((response) => dispatch(setPosts(response.data.data.reverse())))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (posts.length) return;

    fetchPosts();
  });

  return { isLoading, fetchPosts };
};

export default useFetchPosts;
