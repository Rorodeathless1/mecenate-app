export const colors = {
  background: "#FFFFFF",
  backgroundSecondary: "#F3F3F3",
  surface: "#FFFFFF",
  border: "#E8ECEF",

  primary: "#9747FF",
  primaryDark: "#6115CD",
  primaryLight: "#D5C9FF",
  primaryFaded: "#C0A1EB",

  like: "#FF2B75",
  likeDark: "#D82463",

  text: "#111416",
  textSecondary: "#57626F",
  textMuted: "#A4AAB0",
  textDisabled: "#B6BEC8",

  skeleton: "#EFF2F7",
  skeletonShimmer: "#E2E8F0",

  paid: "#9747FF",
  paidOverlay: "rgba(0,0,0,0.55)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 5,
  md: 8,
  lg: 12,
  full: 999,
};

export const typography = {
  small: { fontSize: 11, fontWeight: "400" as const, color: "#A4AAB0" },
  h2: { fontSize: 18, fontWeight: "700" as const, color: "#111416" },
  h3: { fontSize: 16, fontWeight: "600" as const, color: "#111416" },
  body: { fontSize: 14, fontWeight: "400" as const, color: "#111416" },
  bodySecondary: { fontSize: 14, fontWeight: "400" as const, color: "#57626F" },
  caption: { fontSize: 12, fontWeight: "400" as const, color: "#57626F" },
  link: { fontSize: 14, fontWeight: "400" as const, color: "#9747FF" },
};
