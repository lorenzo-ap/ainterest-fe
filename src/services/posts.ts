import { createPost, deleteUserPost, getPosts, getUserPosts, likeUserPost } from '../api';
import { addPost, deletePost, setPosts, setUserPosts, updatePostLike } from '../redux/slices';
import { store } from '../redux/store';
import { GeneratedImage } from '../types';

export const postService = {
  setPosts: async () => {
    return getPosts().then((res) => {
      store.dispatch(setPosts(res.data.reverse()));
    });
  },
  createPost: async (image: GeneratedImage) => {
    return createPost(image).then((res) => {
      store.dispatch(addPost(res.data));
    });
  },

  setUserPosts: async (userId: string) => {
    return getUserPosts(userId).then((res) => {
      store.dispatch(setUserPosts(res.data.reverse()));
    });
  },
  deleteUserPost: async (postId: string) => {
    return deleteUserPost(postId).then(() => {
      store.dispatch(deletePost(postId));
    });
  },

  reactToPost: async (postId: string, userId: string) => {
    store.dispatch(updatePostLike({ postId, userId }));

    likeUserPost(postId).then();
  }
};
