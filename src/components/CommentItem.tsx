import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Comment } from "../types";
import { colors, spacing, radius, typography } from "../constants/tokens";

interface Props {
  comment: Comment;
}

export const CommentItem = ({ comment }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: comment.author.avatarUrl }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{comment.author.displayName}</Text>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
      <View style={styles.likeContainer}>
        <Text style={styles.likeIcon}>♡</Text>
        <Text style={styles.likeCount}>2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.body,
    fontWeight: "600",
    color: colors.text,
  },
  text: {
    ...typography.bodySecondary,
  },
  likeContainer: {
    alignItems: "center",
    gap: 2,
  },
  likeIcon: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  likeCount: {
    ...typography.small,
  },
});
