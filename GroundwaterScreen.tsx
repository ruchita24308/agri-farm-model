import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { GWTrendChart } from "../components/GWTrendChart";
import { StatusBadge } from "../components/StatusBadge";
import { colors, gwStatusColor } from "../theme/colors";
import { RecommendResponse } from "../types";
import { TranslationKey } from "../i18n";

type ParamList = { Groundwater: { result: RecommendResponse } };

const STATUS_EXPLAIN: Record<string, TranslationKey> = {
  Depleting: "depletingExplain",
  Stable: "stableExplain",
  Improving: "improvingExplain",
  "Insufficient Data": "insufficientExplain",
};

const STATUS_LABEL: Record<string, TranslationKey> = {
  Depleting: "depleting",
  Stable: "stable",
  Improving: "improving",
  "Insufficient Data": "insufficientData",
};

export const GroundwaterScreen: React.FC = () => {
  const { t } = useLanguage();
  const route = useRoute<RouteProp<ParamList, "Groundwater">>();
  const { groundwater } = route.params.result;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <Text style={styles.title}>💧 {t("groundwaterStatus")}</Text>

        <View style={styles.statusRow}>
          <StatusBadge label={t(STATUS_LABEL[groundwater.status])} color={gwStatusColor(groundwater.status)} />
        </View>

        {groundwater.current_level_mbgl !== null && (
          <Text style={styles.level}>
            {t("currentLevel")}: {groundwater.current_level_mbgl} mbgl
          </Text>
        )}

        <Text style={styles.explain}>{t(STATUS_EXPLAIN[groundwater.status])}</Text>

        <Text style={styles.sectionLabel}>{t("historicalTrend")}</Text>
        <View style={styles.chartCard}>
          <GWTrendChart history={groundwater.history} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollPad: { padding: 20, paddingBottom: 40, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 16 },
  statusRow: { marginBottom: 12 },
  level: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 10 },
  explain: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 20, lineHeight: 20 },
  sectionLabel: { fontSize: 15, fontWeight: "700", color: colors.text, alignSelf: "flex-start", marginBottom: 8 },
  chartCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
});