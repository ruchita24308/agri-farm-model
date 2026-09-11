import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { colors } from "../theme/colors";
import { Language } from "../types";

const OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "hi", label: "हिंदी (Hindi)" },
];

export const LanguageSelectScreen: React.FC = () => {
  const { setLanguage } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose your language</Text>
      <Text style={styles.subtitle}>మీ భాషను ఎంచుకోండి · अपनी भाषा चुनें</Text>

      <View style={styles.optionsBox}>
        {OPTIONS.map((opt) => (
          <Text
            key={opt.code}
            onPress={() => setLanguage(opt.code)}
            style={styles.option}
          >
            {opt.label}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 40 },
  optionsBox: { gap: 14 },
  option: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
});