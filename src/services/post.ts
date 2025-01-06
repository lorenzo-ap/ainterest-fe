import api from '../api/axios';
import { addPost, setPosts } from '../redux/slices/postsSlice';
import { store } from '../redux/store';
import { GeneratedImage, Post } from '../types/post.interface';

const slug = 'posts';

export const postService = {
  getPosts: async () => {
    return api.get<Post[]>(slug).then((res) => {
      store.dispatch(setPosts(res.data.reverse()));
    });
  },

  createPost: async (image: GeneratedImage) => {
    return api.post(slug, image).then((res) => {
      store.dispatch(addPost(res.data));
    });
  },

  getUserPosts: async (userId: string) => {
    return api.get<Post[]>(`${slug}/${userId}`);
  }
};
