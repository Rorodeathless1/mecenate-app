import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { postStore } from "../stores/PostStore";
import { LikeButton } from "../components/LikeButton";
import { CommentItem } from "../components/CommentItem";
import { CommentInput } from "../components/CommentInput";
import { RootStackParamList } from "../navigation";
import { colors, spacing, radius, typography } from "../constants/tokens";

type Nav = NativeStackNavigationProp<RootStackParamList, "PostDetail">;
type Route = RouteProp<RootStackParamList, "PostDetail">;

export const PostDetailScreen = observer(() => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { postId } = route.params;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    postStore.fetchPost(postId);
    postStore.resetComments();
    postStore.fetchComments(postId);

    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      postStore.resetComments();
      showSub.remove();
    };
  }, [postId]);

  const handleLoadMoreComments = () => {
    if (!postStore.isLoadingComments && postStore.hasMoreComments) {
      postStore.fetchComments(postId);
    }
  };

  const handleSendComment = (text: string) => {
    postStore.sendComment(postId, text);
  };

  const handleLike = () => {
    postStore.toggleLike(postId);
  };

  if (postStore.isLoadingPost) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (postStore.postError || !postStore.currentPost) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {postStore.postError ?? "Не удалось загрузить публикацию"}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => postStore.fetchPost(postId)}
        >
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const post = postStore.currentPost;
  const isFree = post.tier === "free";

  const ListHeader = (
    <View>
      {/* Автор */}
      <View style={styles.author}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <Text style={styles.authorName}>{post.author.displayName}</Text>
      </View>

      {/* Обложка */}
      <Image source={{ uri: post.coverUrl }} style={styles.cover} />

      {/* Контент */}
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        {isFree ? (
          <Text style={styles.body}>{post.body || post.preview}</Text>
        ) : (
          <View style={styles.lockedContainer}>
            <View style={styles.paidIcon}>
              <Text style={styles.paidIconText}>$</Text>
            </View>
            <Text style={styles.lockedText}>
              Контент скрыт пользователем.{"\n"}Доступ откроется после доната
            </Text>
            <TouchableOpacity style={styles.donateButton}>
              <Text style={styles.donateButtonText}>Отправить донат</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Кнопки лайк + комментарий — только для free */}
        {isFree && (
          <View style={styles.actions}>
            <LikeButton
              isLiked={post.isLiked}
              likesCount={post.likesCount}
              onPress={handleLike}
              disabled={postStore.isLiking}
            />
            <View style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionCount}>{post.commentsCount}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Комментарии — только для free */}
      {isFree && (
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsCount}>
            {post.commentsCount} комментария
          </Text>
          <TouchableOpacity>
            <Text style={styles.commentsSort}>Сначала новые</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
      >
        <FlatList
          ref={flatListRef}
          data={isFree ? postStore.comments : []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentWrapper}>
              <CommentItem comment={item} />
            </View>
          )}
          ListHeaderComponent={ListHeader}
          onEndReached={handleLoadMoreComments}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            postStore.isLoadingComments ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ paddingVertical: spacing.lg }}
              />
            ) : null
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Поле ввода — только для free */}
        {isFree && (
          <CommentInput
            onSend={handleSendComment}
            disabled={postStore.isSendingComment}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    ...typography.h3,
    textAlign: "center",
    color: colors.text,
  },
  retryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  retryButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  author: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
  },
  authorName: {
    ...typography.body,
    fontWeight: "600",
  },
  cover: {
    width: "100%",
    height: 260,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  title: {
    ...typography.h2,
  },
  body: {
    ...typography.bodySecondary,
    lineHeight: 22,
  },
  lockedContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  paidIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  paidIconText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 18,
  },
  lockedText: {
    ...typography.bodySecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  donateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  donateButtonText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: 15,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    minWidth: 64,
    height: 36,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionCount: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "500",
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  commentsCount: {
    ...typography.body,
    fontWeight: "600",
  },
  commentsSort: {
    ...typography.link,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  commentWrapper: {
    paddingHorizontal: spacing.lg,
  },
});
