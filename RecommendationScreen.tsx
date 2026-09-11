import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { CropCard } from "../components/CropCard";
import { colors } from "../theme/colors";
import { RecommendResponse } from "../types";

type ParamList = { Recommendations: { result: RecommendResponse } };

export const RecommendationScreen: React.FC = () => {
  const { t } = useLanguage();
  const route = useRoute<RouteProp<ParamList, "Recommendations">>();
  const { result } = route.params;
  const [best, ...rest] = result.recommendations;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <Text style={styles.title}>🌱 {t("recommendedCrops")}</Text>
        <Text style={styles.subtitle}>
          {result.location.district}, {result.location.state}
        </Text>

        {best && (
          <>
            <Text style={styles.sectionLabel}>{t("bestRecommendation")}</Text>
            <CropCard rank={1} rec={best} featured />
          </>
        )}

        {rest.map((rec, idx) => (
          <CropCard key={rec.crop} rank={idx + 2} rec={rec} />
        ))}

        {result.npk.is_state_average && (
          <Text style={styles.footnote}>{t("npkStateAverageNote")}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollPad: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 20 },
  sectionLabel: { fontSize: 15, fontWeight: "700", color: colors.primary, marginBottom: 8 },
  footnote: { fontSize: 12, color: colors.textMuted, marginTop: 8, fontStyle: "italic", textAlign: "center" },
});