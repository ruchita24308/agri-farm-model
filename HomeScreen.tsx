import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import { LocationInfo, WeatherInfo, RecommendResponse } from "../types";
import { requestLocationPermission, detectLocation } from "../services/location";
import { fetchLiveWeather, humidityLabel, rainfallLabel } from "../services/weather";
import { fetchRecommendations } from "../services/api";

type Stage = "loading" | "error" | "manual" | "ready";

export const HomeScreen: React.FC = () => {
  const { t } = useLanguage();
  const navigation = useNavigation<any>();

  const [stage, setStage] = useState<Stage>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [result, setResult] = useState<RecommendResponse | null>(null);

  const [manualState, setManualState] = useState("Telangana");
  const [manualDistrict, setManualDistrict] = useState("");
  const [manualTemp, setManualTemp] = useState("28");
  const [manualHumidity, setManualHumidity] = useState("55");
  const [manualRainfall, setManualRainfall] = useState("3");

  const runPipeline = useCallback(async (loc: LocationInfo, wx: WeatherInfo) => {
    try {
      const res = await fetchRecommendations(loc.state, loc.district, {
        temperature_c: wx.temperature_c,
        humidity_pct: wx.humidity_pct,
        rainfall_mm_per_day: wx.rainfall_mm_per_day,
      });
      setResult(res);
      setStage("ready");
    } catch (e) {
      setErrorMsg(t("weatherUnavailable"));
      setStage("error");
    }
  }, [t]);

  const autoDetect = useCallback(async () => {
    setStage("loading");
    const granted = await requestLocationPermission();
    if (!granted) {
      setErrorMsg(t("locationPermissionDenied"));
      setStage("manual");
      return;
    }
    const loc = await detectLocation();
    if (!loc || !loc.state || !loc.district) {
      setErrorMsg(t("locationUnavailable"));
      setStage("manual");
      return;
    }
    setLocation(loc);

    const wx = await fetchLiveWeather(loc.latitude, loc.longitude);
    if (!wx) {
      setErrorMsg(t("weatherUnavailable"));
      setStage("manual");
      return;
    }
    setWeather(wx);
    await runPipeline(loc, wx);
  }, [runPipeline, t]);

  useEffect(() => {
    autoDetect();
  }, [autoDetect]);

  const submitManual = async () => {
    const loc: LocationInfo = {
      state: manualState,
      district: manualDistrict,
      area: manualDistrict,
      latitude: 0,
      longitude: 0,
    };
    const wx: WeatherInfo = {
      temperature_c: parseFloat(manualTemp) || 28,
      humidity_pct: parseFloat(manualHumidity) || 55,
      rainfall_mm_per_day: parseFloat(manualRainfall) || 3,
      timestamp: new Date().toISOString(),
      source: "Manual entry",
      isManualFallback: true,
    };
    setLocation(loc);
    setWeather(wx);
    setStage("loading");
    await runPipeline(loc, wx);
  };

  if (stage === "loading") {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t("detecting")}</Text>
      </SafeAreaView>
    );
  }

  if (stage === "manual") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollPad}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Text style={styles.sectionTitle}>{t("selectManually")}</Text>

          <Text style={styles.inputLabel}>{t("state")}</Text>
          <TextInput style={styles.input} value={manualState} onChangeText={setManualState} />

          <Text style={styles.inputLabel}>{t("district")}</Text>
          <TextInput
            style={styles.input}
            value={manualDistrict}
            onChangeText={setManualDistrict}
            placeholder="e.g. Khammam"
          />

          <Text style={styles.sectionTitle}>{t("enterManually")}: {t("weather")}</Text>
          <Text style={styles.inputLabel}>{t("temperature")} (°C)</Text>
          <TextInput style={styles.input} value={manualTemp} onChangeText={setManualTemp} keyboardType="numeric" />

          <Text style={styles.inputLabel}>{t("humidity")} (%)</Text>
          <TextInput style={styles.input} value={manualHumidity} onChangeText={setManualHumidity} keyboardType="numeric" />

          <Text style={styles.inputLabel}>{t("rainfall")} (mm/day)</Text>
          <TextInput style={styles.input} value={manualRainfall} onChangeText={setManualRainfall} keyboardType="numeric" />

          <PrimaryButton label={t("save")} onPress={submitManual} disabled={!manualDistrict} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (stage === "ready" && location && weather && result) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollPad}>
          <Text style={styles.appTitle}>{t("appName")}</Text>
          <Text style={styles.tagline}>{t("tagline")}</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 {t("yourLocation")}</Text>
            <Text style={styles.rowText}>{t("state")}: {location.state}</Text>
            <Text style={styles.rowText}>{t("district")}: {location.district}</Text>
            <Text style={styles.rowText}>{t("area")}: {location.area}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌦 {t("weather")}</Text>
            <Text style={styles.rowText}>🌡️ {t("temperature")}: {weather.temperature_c}°C</Text>
            <Text style={styles.rowText}>💧 {t("humidity")}: {t(humidityLabel(weather.humidity_pct).toLowerCase() as any)}</Text>
            <Text style={styles.rowText}>🌧️ {t("rainfall")}: {t(rainfallLabel(weather.rainfall_mm_per_day).toLowerCase() as any)}</Text>
            <Text style={styles.footnote}>{weather.source} · {new Date(weather.timestamp).toLocaleString()}</Text>
          </View>

          <PrimaryButton label={`🌱 ${t("viewRecommendations")}`} onPress={() => navigation.navigate("Recommendations", { result })} />
          <PrimaryButton label={`💧 ${t("viewGroundwater")}`} variant="outline" onPress={() => navigation.navigate("Groundwater", { result })} />
          <PrimaryButton label={`📤 ${t("shareSummary")}`} variant="outline" onPress={() => navigation.navigate("Share", { result })} />
          <PrimaryButton label={`⚙️ ${t("settings")}`} variant="outline" onPress={() => navigation.navigate("Settings")} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.centerContainer}>
      <Text style={styles.errorText}>{errorMsg}</Text>
      <PrimaryButton label={t("retry")} onPress={autoDetect} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 24 },
  scrollPad: { padding: 20, paddingBottom: 40 },
  loadingText: { marginTop: 16, color: colors.textMuted },
  errorText: { color: colors.danger, textAlign: "center", marginBottom: 16, fontSize: 15 },
  appTitle: { fontSize: 28, fontWeight: "800", color: colors.primary, textAlign: "center" },
  tagline: { fontSize: 13, color: colors.textMuted, textAlign: "center", marginBottom: 20 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: colors.text },
  rowText: { fontSize: 15, color: colors.text, marginBottom: 3 },
  footnote: { fontSize: 11, color: colors.textMuted, marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 16, marginBottom: 8, color: colors.text },
  inputLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
});