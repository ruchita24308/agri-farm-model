import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Share, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import { RecommendResponse } from "../types";
import { fetchShareSummary } from "../services/api";

type ParamList = { Share: { result: RecommendResponse } };

/** Shareable dashboard tailored for extension workers / farmer-group
 * communication: plain, SMS/WhatsApp-friendly text built server-side from
 * the same real calculation output shown on-screen. */
export const ShareSummaryScreen: React.FC = () => {
  const { t } = useLanguage();
  const route = useRoute<RouteProp<ParamList, "Share">>();
  const { result } = route.params;

  const [groupName, setGroupName] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [loading, setLoading] = useState(false);

  const buildSummary = async () => {
    setLoading(true);
    try {
      const text = await fetchShareSummary(result, groupName);
      setSummaryText(text);
    } catch (e) {
      Alert.alert("Error", "Could not build summary. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const shareNow = async () => {
    if (!summaryText) await buildSummary();
    try {
      await Share.share({ message: summaryText });
    } catch (e) {
      // no-op: user cancelled share sheet
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <Text style={styles.title}>{t("shareTitle")}</Text>
        <Text style={styles.subtitle}>{t("shareDescription")}</Text>

        <Text style={styles.inputLabel}>{t("groupName")}</Text>
        <TextInput
          style={styles.input}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="e.g. Khammam Farmer Group"
        />

        <PrimaryButton label={t("save")} variant="outline" onPress={buildSummary} disabled={loading} />

        {summaryText.length > 0 && (
          <View style={styles.previewCard}>
            <Text style={styles.previewText}>{summaryText}</Text>
          </View>
        )}

        <PrimaryButton label={`📤 ${t("share")}`} onPress={shareNow} disabled={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollPad: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: "center", marginBottom: 18 },
  inputLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 15 },
  previewCard: { backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, marginVertical: 16 },
  previewText: { fontSize: 13, color: colors.text, lineHeight: 19 },
});