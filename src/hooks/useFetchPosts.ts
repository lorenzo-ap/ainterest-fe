import { useEffect, useState } from 'react';
import axios from 'axios';

import { Post } from '../types/post.interface';

interface PostAPIResponse {
  success: boolean;
  data: Post[];
}

const useFetchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = () => {
      setIsLoading(true);

      axios
        .get<PostAPIResponse>(`${import.meta.env.VITE_API_URL}/api/v1/post`)
        .then((response) => setPosts(response.data.data.reverse()))
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    };

    fetchPosts();
  }, []);

  return { posts, isLoading };
};

export default useFetchPosts;
