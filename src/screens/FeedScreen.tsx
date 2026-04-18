import React, { useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { postStore } from "../stores/PostStore";
import { PostCard } from "../components/PostCard";
import { useWebSocket } from "../hooks/useWebSocket";
import { Post, RootStackParamList, TierFilter } from "../types";
import { colors, spacing, radius, typography } from "../constants/tokens";

type Nav = NativeStackNavigationProp<RootStackParamList, "Feed">;

const TABS: { label: string; value: TierFilter }[] = [
  { label: "Все", value: "all" },
  { label: "Бесплатные", value: "free" },
  { label: "Платные", value: "paid" },
];

export const FeedScreen = observer(() => {
  const navigation = useNavigation<Nav>();
  useWebSocket();

  useEffect(() => {
    postStore.fetchPosts();
  }, []);

  const handlePostPress = (post: Post) => {
    navigation.navigate("PostDetail", { postId: post.id });
  };

  const handleEndReached = () => {
    if (!postStore.isLoadingFeed && postStore.hasMore) {
      postStore.fetchPosts();
    }
  };

  const renderFooter = () => {
    if (!postStore.isLoadingFeed) return null;
    return (
      <ActivityIndicator
        color={colors.primary}
        style={{ paddingVertical: spacing.xl }}
      />
    );
  };

  const renderEmpty = () => {
    if (postStore.isLoadingFeed) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          По вашему запросу ничего не найдено
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => postStore.setTierFilter("all")}
        >
          <Text style={styles.emptyButtonText}>На главную</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Табы */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[
                styles.tab,
                postStore.tierFilter === tab.value && styles.tabActive,
              ]}
              onPress={() => postStore.setTierFilter(tab.value)}
            >
              <Text
                style={[
                  styles.tabText,
                  postStore.tierFilter === tab.value && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Лента */}
      <FlatList
        data={postStore.posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={handlePostPress} />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={postStore.isRefreshing}
            onRefresh={() => postStore.refreshFeed()}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  tabsContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    height: 38,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  tabActive: {
    backgroundColor: colors.primaryDark,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.background,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  emptyText: {
    ...typography.h3,
    textAlign: "center",
    color: colors.text,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
  },
  emptyButtonText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: 16,
  },
});
