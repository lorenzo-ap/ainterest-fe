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
import { PostGeneratedImage } from '../types';

export const postService = {
  createPost: async (image: PostGeneratedImage) => {
    const res = await createPost(image);
    const posts = store.getState().posts.posts;

    if (!posts.length) {
      postService.setPosts();
    }

    store.dispatch(addPost(res.data));
  },
  setPosts: async () => {
    const res = await getPosts();
    store.dispatch(setPosts(res.data.reverse()));
  },
  reactToPost: async (postId: string, userId: string) => {
    const postDetails = {
      postId,
      userId
    };

    store.dispatch(updatePostLike(postDetails));
    store.dispatch(updateUserPostLike(postDetails));

    try {
      await likePost(postId);
    } catch (error) {
      store.dispatch(updatePostLike(postDetails));
      store.dispatch(updateUserPostLike(postDetails));
    }
  },
  deletePost: async (postId: string) => {
    await deletePost(postId);
    store.dispatch(removePost(postId));
    store.dispatch(removeUserPost(postId));
  },

  setUserPosts: async (userId: string) => {
    const res = await getUserPosts(userId);
    store.dispatch(setUserPosts(res.data.reverse()));
  }
};
