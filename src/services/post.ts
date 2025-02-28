import { createPost, getPosts, likeUserPost } from '../api';
import { addPost, setPosts, updatePostLike, updateUserPostLike } from '../redux/slices';
import { store } from '../redux/store';
import { GeneratedImage } from '../types';

export const postService = {
  getPosts: async () => {
    return getPosts().then((res) => {
      store.dispatch(setPosts(res.data.reverse()));
    });
  },

  createPost: async (image: GeneratedImage) => {
    return createPost(image).then((res) => {
      store.dispatch(addPost(res.data));
    });
  },

  reactToPost: async (postId: string, userId: string) => {
    store.dispatch(updatePostLike({ postId, userId }));
    store.dispatch(updateUserPostLike({ postId, userId }));

    likeUserPost(postId).then();
  }
};
