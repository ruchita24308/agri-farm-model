export const colors = {
  primary: "#1B7A3D",
  primaryDark: "#0F5C2A",
  background: "#F5F9F4",
  card: "#FFFFFF",
  text: "#1A1A1A",
  textMuted: "#6B7A70",
  border: "#DCE7DE",
  danger: "#C0392B",
  warning: "#D4A017",
  success: "#1B7A3D",
  white: "#FFFFFF",
};

export const riskColor = (level: "Low" | "Moderate" | "High" | string) => {
  if (level === "Low") return colors.success;
  if (level === "Moderate") return colors.warning;
  if (level === "High") return colors.danger;
  return colors.textMuted;
};

export const gwStatusColor = (status: string) => {
  if (status === "Depleting") return colors.danger;
  if (status === "Improving") return colors.success;
  if (status === "Stable") return colors.warning;
  return colors.textMuted;
};