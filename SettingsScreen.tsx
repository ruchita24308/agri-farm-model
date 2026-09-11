import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { colors } from "../theme/colors";
import { Language } from "../types";

const OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिंदी" },
];

export const SettingsScreen: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("settings")}</Text>
      <Text style={styles.sectionLabel}>{t("changeLanguage")}</Text>
      {OPTIONS.map((opt) => (
        <Text
          key={opt.code}
          onPress={() => setLanguage(opt.code)}
          style={[styles.option, language === opt.code && styles.selected]}
        >
          {opt.label} {language === opt.code ? "✓" : ""}
        </Text>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 24 },
  sectionLabel: { fontSize: 14, color: colors.textMuted, marginBottom: 10 },
  option: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    fontSize: 16,
    color: colors.text,
  },
  selected: { borderColor: colors.primary, borderWidth: 2, fontWeight: "700" },
});