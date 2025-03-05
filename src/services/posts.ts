import { createPost, deletePost, getPosts, getUserPosts, likePost } from '../api';
import {
  addPost,
  removePost,
  removeUserPost,
  setPosts,
  setUserPosts,
  updatePostLike,
  updateUserPostLike
} from '../redux/slices';
import { store } from '../redux/store';
import { GeneratedImage } from '../types';

export const postService = {
  createPost: async (image: GeneratedImage) => {
    return createPost(image).then((res) => {
      store.dispatch(addPost(res.data));
    });
  },
  setPosts: async () => {
    return getPosts().then((res) => {
      store.dispatch(setPosts(res.data.reverse()));
    });
  },
  reactToPost: async (postId: string, userId: string) => {
    const postDetails = {
      postId,
      userId
    };

    store.dispatch(updatePostLike(postDetails));
    store.dispatch(updateUserPostLike(postDetails));

    likePost(postId).then();
  },
  deletePost: async (postId: string) => {
    return deletePost(postId).then(() => {
      store.dispatch(removePost(postId));
      store.dispatch(removeUserPost(postId));
    });
  },

  setUserPosts: async (userId: string) => {
    return getUserPosts(userId).then((res) => {
      store.dispatch(setUserPosts(res.data.reverse()));
    });
  }
};
