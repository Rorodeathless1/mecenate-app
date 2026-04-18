import { makeAutoObservable, runInAction } from "mobx";
import { Post, Comment, TierFilter, WSEvent } from "../types";
import {
  getPosts,
  getPostById,
  toggleLike,
  getComments,
  addComment,
} from "../api/posts";

class PostStore {
  // Feed
  posts: Post[] = [];
  isLoadingFeed = false;
  isRefreshing = false;
  hasMore = true;
  nextCursor: string | null = null;
  tierFilter: TierFilter = "all";
  feedError: string | null = null;

  // Post Detail
  currentPost: Post | null = null;
  isLoadingPost = false;
  postError: string | null = null;

  // Comments
  comments: Comment[] = [];
  isLoadingComments = false;
  hasMoreComments = true;
  nextCommentsCursor: string | null = null;
  isSendingComment = false;

  // Like
  isLiking = false;

  constructor() {
    makeAutoObservable(this);
  }

  // --- Feed ---

  setTierFilter(tier: TierFilter) {
    this.tierFilter = tier;
    this.resetFeed();
    this.fetchPosts();
  }

  resetFeed() {
    this.posts = [];
    this.nextCursor = null;
    this.hasMore = true;
    this.feedError = null;
  }

  async fetchPosts() {
    if (this.isLoadingFeed || !this.hasMore) return;

    runInAction(() => {
      this.isLoadingFeed = true;
      this.feedError = null;
    });

    try {
      const res = await getPosts(this.nextCursor || undefined, this.tierFilter);
      runInAction(() => {
        this.posts = [...this.posts, ...res.data.posts];
        this.nextCursor = res.data.nextCursor;
        this.hasMore = res.data.hasMore;
      });
    } catch {
      runInAction(() => {
        this.feedError = "Не удалось загрузить ленту";
      });
    } finally {
      runInAction(() => {
        this.isLoadingFeed = false;
      });
    }
  }

  async refreshFeed() {
    runInAction(() => {
      this.isRefreshing = true;
    });
    this.resetFeed();
    await this.fetchPosts();
    runInAction(() => {
      this.isRefreshing = false;
    });
  }

  // --- Post Detail ---

  async fetchPost(id: string) {
    runInAction(() => {
      this.isLoadingPost = true;
      this.postError = null;
      this.currentPost = null;
    });

    try {
      const res = await getPostById(id);
      runInAction(() => {
        this.currentPost = res.data.post;
      });
    } catch {
      runInAction(() => {
        this.postError = "Не удалось загрузить публикацию";
      });
    } finally {
      runInAction(() => {
        this.isLoadingPost = false;
      });
    }
  }

  // --- Like ---

  async toggleLike(postId: string) {
    if (this.isLiking) return;

    runInAction(() => {
      this.isLiking = true;
    });

    try {
      const res = await toggleLike(postId);
      runInAction(() => {
        // обновляем в ленте
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.isLiked = res.data.isLiked;
          post.likesCount = res.data.likesCount;
        }
        // обновляем в детальном экране
        if (this.currentPost?.id === postId) {
          this.currentPost.isLiked = res.data.isLiked;
          this.currentPost.likesCount = res.data.likesCount;
        }
      });
    } finally {
      runInAction(() => {
        this.isLiking = false;
      });
    }
  }

  // --- Comments ---

  resetComments() {
    this.comments = [];
    this.nextCommentsCursor = null;
    this.hasMoreComments = true;
  }

  async fetchComments(postId: string) {
    if (this.isLoadingComments || !this.hasMoreComments) return;

    runInAction(() => {
      this.isLoadingComments = true;
    });

    try {
      const res = await getComments(
        postId,
        this.nextCommentsCursor || undefined,
      );
      runInAction(() => {
        this.comments = [...this.comments, ...res.data.comments];
        this.nextCommentsCursor = res.data.nextCursor;
        this.hasMoreComments = res.data.hasMore;
      });
    } finally {
      runInAction(() => {
        this.isLoadingComments = false;
      });
    }
  }

  async sendComment(postId: string, text: string) {
    if (this.isSendingComment) return;

    runInAction(() => {
      this.isSendingComment = true;
    });

    try {
      await addComment(postId, text);
      // комментарий придёт через WebSocket
    } finally {
      runInAction(() => {
        this.isSendingComment = false;
      });
    }
  }

  // --- WebSocket events ---

  handleWSEvent(event: WSEvent) {
    if (event.type === "like_updated") {
      runInAction(() => {
        const post = this.posts.find((p) => p.id === event.postId);
        if (post) post.likesCount = event.likesCount;
        if (this.currentPost?.id === event.postId) {
          this.currentPost.likesCount = event.likesCount;
        }
      });
    }

    if (event.type === "comment_added") {
      runInAction(() => {
        const exists = this.comments.some((c) => c.id === event.comment.id);
        if (!exists) {
          this.comments = [event.comment, ...this.comments];
        }
        if (this.currentPost?.id === event.postId) {
          this.currentPost.commentsCount += 1;
        }
      });
    }
  }
}

export const postStore = new PostStore();
