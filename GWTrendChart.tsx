import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line, Circle, Text as SvgText, Polyline } from "react-native-svg";
import { YearValue } from "../types";
import { colors } from "../theme/colors";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  history: YearValue[];
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;
const PADDING = 30;

export const GWTrendChart: React.FC<Props> = ({ history }) => {
  const { t } = useLanguage();
  const available = history.filter((h) => h.available && h.value !== null);

  if (available.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>{t("insufficientExplain")}</Text>
      </View>
    );
  }

  const values = available.map((h) => h.value as number);
  const minV = Math.min(...values) - 1;
  const maxV = Math.max(...values) + 1;
  const xStep = (CHART_WIDTH - PADDING * 2) / (history.length - 1);

  const yFor = (v: number) =>
    CHART_HEIGHT - PADDING - ((v - minV) / (maxV - minV)) * (CHART_HEIGHT - PADDING * 2);

  const points = available
    .map((h) => {
      const idx = history.findIndex((x) => x.year === h.year);
      const x = PADDING + idx * xStep;
      const y = yFor(h.value as number);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Line x1={PADDING} y1={CHART_HEIGHT - PADDING} x2={CHART_WIDTH - PADDING} y2={CHART_HEIGHT - PADDING} stroke={colors.border} strokeWidth={1} />
        <Polyline points={points} fill="none" stroke={colors.primary} strokeWidth={2.5} />
        {available.map((h) => {
          const idx = history.findIndex((x) => x.year === h.year);
          const x = PADDING + idx * xStep;
          const y = yFor(h.value as number);
          return <Circle key={h.year} cx={x} cy={y} r={4} fill={colors.primary} />;
        })}
        {history.map((h, idx) => {
          const x = PADDING + idx * xStep;
          return (
            <SvgText key={h.year} x={x} y={CHART_HEIGHT - 8} fontSize={11} fill={colors.textMuted} textAnchor="middle">
              {h.year}
            </SvgText>
          );
        })}
      </Svg>
      <View style={styles.legendRow}>
        {history.map((h) => (
          <Text key={h.year} style={styles.legendItem}>
            {h.year}: {h.available && h.value !== null ? `${h.value} mbgl` : t("unavailable")}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyBox: { padding: 20, alignItems: "center" },
  emptyText: { color: colors.textMuted, textAlign: "center" },
  legendRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  legendItem: { fontSize: 11, color: colors.textMuted, marginRight: 10, marginBottom: 4 },
});