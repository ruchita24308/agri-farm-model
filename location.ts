import * as Location from "expo-location";
import { LocationInfo } from "../types";

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

export async function detectLocation(): Promise<LocationInfo | null> {
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = position.coords;

    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (!results.length) return null;

    const place = results[0];
    return {
      state: place.region ?? "",
      district: place.subregion ?? place.city ?? "",
      area: place.city ?? place.district ?? place.name ?? "",
      latitude,
      longitude,
    };
  } catch (e) {
    return null;
  }
}