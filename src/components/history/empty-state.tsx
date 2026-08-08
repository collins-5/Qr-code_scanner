import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";

export function EmptyState() {
  const { brand, text } = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center py-20">
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: brand.primary + "20" }}
      >
        <Ionicons name="scan-outline" size={48} color={brand.primary} />
      </View>
      <Text className="text-xl font-semibold mb-2" style={{ color: text.dark }}>
        No Scans Yet
      </Text>
      <Text className="text-center px-8" style={{ color: text.muted }}>
        Scan your first QR code to see it appear here
      </Text>
    </View>
  );
}