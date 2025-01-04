import api from '../api/axios';
import { addPost, setPosts } from '../redux/slices/postsSlice';
import { store } from '../redux/store';
import { GeneratedImage, Post } from '../types/post.interface';

export const postService = {
  getPosts: async () => {
    return api.get<Post[]>('posts').then((res) => {
      store.dispatch(setPosts(res.data.reverse()));
    });
  },

  createPost: async (image: GeneratedImage) => {
    return api.post('posts', image).then((res) => {
      store.dispatch(addPost(res.data));
    });
  }
};
