import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Post } from "../types";
import { colors, spacing, radius, typography } from "../constants/tokens";

interface Props {
  post: Post;
  onPress: (post: Post) => void;
}

export const PostCard = ({ post, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(post)}
      activeOpacity={0.9}
    >
      <View style={styles.author}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <Text style={styles.authorName}>{post.author.displayName}</Text>
      </View>

      {post.tier === "paid" ? (
        <View style={styles.paidCover}>
          <Image
            source={{ uri: post.coverUrl }}
            style={styles.cover}
            blurRadius={8}
          />
          <View style={styles.paidOverlay}>
            <View style={styles.paidIcon}>
              <Text style={styles.paidIconText}>$</Text>
            </View>
            <Text style={styles.paidText}>
              Контент скрыт пользователем.{"\n"}Доступ откроется после доната
            </Text>
            <TouchableOpacity style={styles.donateButton}>
              <Text style={styles.donateButtonText}>Отправить донат</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Image source={{ uri: post.coverUrl }} style={styles.cover} />
      )}

      <View style={styles.content}>
        {post.tier === "paid" ? (
          <>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonText} />
          </>
        ) : (
          <>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.preview} numberOfLines={2}>
              {post.preview}
              {post.preview?.length >= 100 && (
                <Text style={styles.showMore}> Показать ещё</Text>
              )}
            </Text>
          </>
        )}

        {post.tier === "free" && (
          <View style={styles.buttons}>
            <View style={styles.actionButton}>
              <Text
                style={[
                  styles.actionIcon,
                  post.isLiked && { color: colors.like },
                ]}
              >
                {post.isLiked ? "♥" : "♡"}
              </Text>
              <Text
                style={[
                  styles.actionCount,
                  post.isLiked && { color: colors.like },
                ]}
              >
                {post.likesCount}
              </Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionCount}>{post.commentsCount}</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
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
    height: 220,
  },
  paidCover: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  paidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.paidOverlay,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  paidIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  paidIconText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 16,
  },
  paidText: {
    color: colors.background,
    textAlign: "center",
    fontSize: 14,
  },
  donateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  donateButtonText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: 14,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
  },
  preview: {
    ...typography.bodySecondary,
  },
  showMore: {
    ...typography.link,
  },
  skeletonTitle: {
    height: 16,
    width: "50%",
    backgroundColor: colors.skeleton,
    borderRadius: radius.sm,
  },
  skeletonText: {
    height: 14,
    width: "80%",
    backgroundColor: colors.skeleton,
    borderRadius: radius.sm,
  },
  buttons: {
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
});
