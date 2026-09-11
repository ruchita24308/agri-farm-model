import axios from "axios";
import { WeatherInfo } from "../types";

/** Open-Meteo is a free, keyless public weather API - good for a live
 * hackathon demo without needing API-key provisioning. */
export async function fetchLiveWeather(lat: number, lon: number): Promise<WeatherInfo | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_sum&timezone=auto&forecast_days=1`;
    const res = await axios.get(url, { timeout: 8000 });
    const data = res.data;

    const temperature_c = data.current.temperature_2m;
    const humidity_pct = data.current.relative_humidity_2m;
    const rainfall_mm_per_day =
      (data.daily?.precipitation_sum?.[0] as number) ?? data.current.precipitation ?? 0;

    return {
      temperature_c,
      humidity_pct,
      rainfall_mm_per_day,
      timestamp: data.current.time,
      source: "Open-Meteo",
      isManualFallback: false,
    };
  } catch (e) {
    return null;
  }
}

export function humidityLabel(pct: number): "Low" | "Moderate" | "High" {
  if (pct < 40) return "Low";
  if (pct <= 70) return "Moderate";
  return "High";
}

export function rainfallLabel(mmPerDay: number): "Low" | "Moderate" | "High" {
  if (mmPerDay < 2.5) return "Low";
  if (mmPerDay <= 7.5) return "Moderate";
  return "High";
}