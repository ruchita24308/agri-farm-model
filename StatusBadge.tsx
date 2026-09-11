import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { riskColor } from "../theme/colors";

export const StatusBadge: React.FC<{ label: string; color?: string }> = ({ label, color }) => (
  <View style={[styles.badge, { backgroundColor: (color ?? riskColor(label)) + "22", borderColor: color ?? riskColor(label) }]}>
    <Text style={[styles.text, { color: color ?? riskColor(label) }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: { fontSize: 13, fontWeight: "700" },
});