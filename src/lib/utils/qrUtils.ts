import { Scan } from "@/stores/scanStore";

export const detectQRType = (content: string): Scan["type"] => {
  // URL detection
  try {
    const url = new URL(content);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return "url";
    }
  } catch {
    // Not a valid URL
  }

  // Email detection
  if (content.startsWith("mailto:")) {
    return "email";
  }

  // Phone detection
  if (content.startsWith("tel:")) {
    return "phone";
  }

  // WiFi detection
  if (content.startsWith("WIFI:")) {
    return "wifi";
  }

  return "text";
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getTypeIcon = (type: Scan["type"]): string => {
  switch (type) {
    case "url":
      return "link";
    case "email":
      return "mail";
    case "phone":
      return "call";
    case "wifi":
      return "wifi";
    default:
      return "document-text";
  }
};

export const getTypeColor = (type: Scan["type"]): string => {
  switch (type) {
    case "url":
      return "#3b82f6"; // blue
    case "email":
      return "#8b5cf6"; // purple
    case "phone":
      return "#22c55e"; // green
    case "wifi":
      return "#f59e0b"; // amber
    default:
      return "#6b7280"; // gray
  }
};

export const truncateContent = (content: string, maxLength: number = 50): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};