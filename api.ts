import axios from "axios";
import { NPKInfo, GroundwaterInfo, RecommendResponse } from "../types";

// Point this at your backend host. On a physical device this must be your
// machine's LAN IP, not "localhost".
export const API_BASE_URL = "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

export async function fetchNPK(state: string, district: string): Promise<NPKInfo> {
  const res = await client.get(`/api/npk/${encodeURIComponent(state)}/${encodeURIComponent(district)}`);
  return res.data;
}

export async function fetchGroundwater(state: string, district: string): Promise<GroundwaterInfo> {
  const res = await client.get(`/api/groundwater/${encodeURIComponent(state)}/${encodeURIComponent(district)}`);
  return res.data;
}

export async function fetchRecommendations(
  state: string,
  district: string,
  weather: { temperature_c: number; humidity_pct: number; rainfall_mm_per_day: number }
): Promise<RecommendResponse> {
  const res = await client.post("/api/recommend", { state, district, weather });
  return res.data;
}

export async function fetchShareSummary(
  recommend: RecommendResponse,
  groupName?: string
): Promise<string> {
  const res = await client.post("/api/summary/text", {
    farmer_or_group_name: groupName || null,
    recommend,
  });
  return res.data.text;
}