export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: "free" | "paid";
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface PostsResponse {
  ok: boolean;
  data: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface PostDetailResponse {
  ok: boolean;
  data: { post: Post };
}

export interface CommentsResponse {
  ok: boolean;
  data: {
    comments: Comment[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface LikeResponse {
  ok: boolean;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
}

export type TierFilter = "all" | "free" | "paid";

export type WSEvent =
  | { type: "ping" }
  | { type: "like_updated"; postId: string; likesCount: number }
  | { type: "comment_added"; postId: string; comment: Comment };

export type RootStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
};
