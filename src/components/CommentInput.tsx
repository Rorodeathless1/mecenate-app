import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { colors, spacing, radius, typography } from "../constants/tokens";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const CommentInput = ({ onSend, disabled }: Props) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ваш комментарий"
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        multiline={false}
        maxLength={500}
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={handleSend}
        disabled={disabled || !text.trim()}
        style={[
          styles.sendButton,
          (!text.trim() || disabled) && styles.sendButtonDisabled,
        ]}
      >
        <Text style={styles.sendIcon}>➤</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  sendIcon: {
    color: colors.background,
    fontSize: 16,
  },
});
