export type FilterType = "all" | "url" | "text" | "email" | "phone" | "wifi";

export const FILTERS = [
  { value: "all" as const, label: "All" },
  { value: "url" as const, label: "URL" },
  { value: "text" as const, label: "Text" },
  { value: "email" as const, label: "Email" },
  { value: "phone" as const, label: "Phone" },
  { value: "wifi" as const, label: "WiFi" },
] as const;