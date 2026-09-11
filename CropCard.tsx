import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CropRecommendation } from "../types";
import { StatusBadge } from "./StatusBadge";
import { colors } from "../theme/colors";
import { useLanguage } from "../context/LanguageContext";
import { TranslationKey } from "../i18n";

interface Props {
  rank: number;
  rec: CropRecommendation;
  featured?: boolean;
}

export const CropCard: React.FC<Props> = ({ rank, rec, featured }) => {
  const { t } = useLanguage();

  return (
    <View style={[styles.card, featured && styles.featuredCard]}>
      <View style={styles.headerRow}>
        <Text style={styles.rank}>{featured ? "🥇" : `${rank}.`}</Text>
        <Text style={styles.cropName}>{rec.crop.charAt(0).toUpperCase() + rec.crop.slice(1)}</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t("suitabilityScore")}</Text>
          <Text style={styles.metricValue}>{rec.suitability_score}%</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t("waterDemand")}</Text>
          <StatusBadge label={t(rec.water_demand.toLowerCase() as TranslationKey)} />
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t("groundwaterRisk")}</Text>
          <StatusBadge label={t(rec.groundwater_risk.toLowerCase() as TranslationKey)} />
        </View>
      </View>

      {featured && rec.reason_codes.length > 0 && (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>{t("whyThisCrop")}</Text>
          {rec.reason_codes.map((code) => (
            <Text key={code} style={styles.reasonLine}>
              • {t((`reason_${code}` as unknown) as TranslationKey)}
            </Text>
          ))}
        </View>
      )}

      {rec.water_demand_is_estimated && (
        <Text style={styles.footnote}>{t("dataEstimatedNote")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featuredCard: { borderColor: colors.primary, borderWidth: 2 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rank: { fontSize: 20, marginRight: 8 },
  cropName: { fontSize: 20, fontWeight: "700", color: colors.text },
  metricsRow: { flexDirection: "row", justifyContent: "space-between" },
  metric: { alignItems: "flex-start" },
  metricLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  metricValue: { fontSize: 16, fontWeight: "700", color: colors.text },
  reasonBox: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  reasonTitle: { fontSize: 14, fontWeight: "700", marginBottom: 6, color: colors.text },
  reasonLine: { fontSize: 13, color: colors.textMuted, marginBottom: 3 },
  footnote: { fontSize: 11, color: colors.textMuted, marginTop: 8, fontStyle: "italic" },
});