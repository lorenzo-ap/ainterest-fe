import api from '../api/axios';
import { addPost, setPosts, setUserPosts, updatePost, updateUserPost } from '../redux/slices/postsSlice';
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
    return api.get<Post[]>(`${slug}/${userId}`).then((res) => {
      store.dispatch(setUserPosts(res.data.reverse()));
    });
  },

  likePost: async (postId: string) => {
    return api.put<Post>(`${slug}/${postId}`).then((res) => {
      store.dispatch(updatePost(res.data));
      store.dispatch(updateUserPost(res.data));
    });
  }
};
