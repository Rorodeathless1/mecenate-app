import { apiClient } from "./client";
import {
  PostsResponse,
  PostDetailResponse,
  CommentsResponse,
  LikeResponse,
  TierFilter,
} from "../types";

export const getPosts = async (
  cursor?: string,
  tier?: TierFilter,
): Promise<PostsResponse> => {
  const { data } = await apiClient.get("/posts", {
    params: {
      limit: 10,
      ...(cursor && { cursor }),
      ...(tier && tier !== "all" && { tier }),
    },
  });
  return data;
};

export const getPostById = async (id: string): Promise<PostDetailResponse> => {
  const { data } = await apiClient.get(`/posts/${id}`);
  return data;
};

export const toggleLike = async (id: string): Promise<LikeResponse> => {
  const { data } = await apiClient.post(`/posts/${id}/like`);
  return data;
};

export const getComments = async (
  postId: string,
  cursor?: string,
): Promise<CommentsResponse> => {
  const { data } = await apiClient.get(`/posts/${postId}/comments`, {
    params: {
      limit: 20,
      ...(cursor && { cursor }),
    },
  });
  return data;
};

export const addComment = async (
  postId: string,
  text: string,
): Promise<void> => {
  await apiClient.post(`/posts/${postId}/comments`, { text });
};
