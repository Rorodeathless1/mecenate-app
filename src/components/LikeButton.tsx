import React, { useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, spacing, radius, typography } from "../constants/tokens";

interface Props {
  isLiked: boolean;
  likesCount: number;
  onPress: () => void;
  disabled?: boolean;
}

export const LikeButton = ({
  isLiked,
  likesCount,
  onPress,
  disabled,
}: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 50,
        bounciness: 10,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 5,
      }),
    ]).start();
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animate();
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.button,
          isLiked && styles.buttonActive,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={[styles.icon, isLiked && styles.iconActive]}>
          {isLiked ? "♥" : "♡"}
        </Text>
        <Text style={[styles.count, isLiked && styles.countActive]}>
          {likesCount}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
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
  buttonActive: {
    backgroundColor: colors.like + "20",
  },
  icon: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  iconActive: {
    color: colors.like,
  },
  count: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "500",
  },
  countActive: {
    color: colors.like,
  },
});
