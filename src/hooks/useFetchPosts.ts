import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/slices/postsSlice';
import { AppDispatch, RootState } from '../redux/store';
import { APIResponse } from '../types/api-response.interface';
import { Post } from '../types/post.interface';

const useFetchPosts = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const fetchPosts = () => {
    setIsLoading(true);

    axios
      .get<APIResponse<Post[]>>(`${import.meta.env.VITE_API_URL}/api/v1/post`)
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
