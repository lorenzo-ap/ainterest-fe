import api from '../api/axios';
import { addPost, likePost, likeUserPost, setPosts, setUserPosts } from '../redux/slices/postsSlice';
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
      const userPosts = {
        userId,
        posts: res.data.reverse()
      };

      store.dispatch(setUserPosts(userPosts));
    });
  },

  likePost: async (postId: string, userId: string) => {
    store.dispatch(likePost({ postId, userId }));
    store.dispatch(likeUserPost({ postId, userId }));

    api.put<Post>(`${slug}/${postId}`).then();
  }
};
