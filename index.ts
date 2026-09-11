export type Language = "en" | "te" | "hi";

export interface LocationInfo {
  state: string;
  district: string;
  area: string;
  latitude: number;
  longitude: number;
}

export interface WeatherInfo {
  temperature_c: number;
  humidity_pct: number;
  rainfall_mm_per_day: number;
  timestamp: string;
  source: string;
  isManualFallback: boolean;
}

export interface NPKInfo {
  state: string;
  district: string;
  matched_district: string;
  n: number;
  p: number;
  k: number;
  is_state_average: boolean;
}

export interface YearValue {
  year: number;
  value: number | null;
  available: boolean;
}

export interface GroundwaterInfo {
  state: string;
  district: string;
  matched_district: string;
  status: "Depleting" | "Stable" | "Improving" | "Insufficient Data";
  current_level_mbgl: number | null;
  slope_mbgl_per_year: number | null;
  history: YearValue[];
  insufficient_data: boolean;
}

export interface CropRecommendation {
  crop: string;
  suitability_score: number;
  dataset_baseline_score: number;
  water_demand: "Low" | "Moderate" | "High";
  water_demand_is_estimated: boolean;
  groundwater_risk: "Low" | "Moderate" | "High";
  final_score: number;
  reason_codes: string[];
}

export interface RecommendResponse {
  location: { state: string; district: string; area?: string };
  npk: NPKInfo;
  groundwater: GroundwaterInfo;
  weather: { temperature_c: number; humidity_pct: number; rainfall_mm_per_day: number };
  recommendations: CropRecommendation[];
}