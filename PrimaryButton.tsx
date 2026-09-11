import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  style?: ViewStyle;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<Props> = ({ label, onPress, variant = "primary", style, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.base,
      variant === "primary" ? styles.primary : styles.outline,
      disabled && styles.disabled,
      style,
    ]}
    activeOpacity={0.8}
  >
    <Text style={variant === "primary" ? styles.primaryText : styles.outlineText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary },
  disabled: { opacity: 0.5 },
  primaryText: { color: colors.white, fontSize: 17, fontWeight: "700" },
  outlineText: { color: colors.primary, fontSize: 17, fontWeight: "700" },
});