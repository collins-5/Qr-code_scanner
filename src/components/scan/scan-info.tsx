import { View, Text } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatDate, getTypeColor } from "@/lib/utils/qrUtils";
import { Scan } from "@/stores/scanStore";

interface ScanInfoProps {
  scan: Scan;
}

export function ScanInfo({ scan }: ScanInfoProps) {
  const { surface, text, border } = useThemeColors();
  const typeColor = getTypeColor(scan.type);

  return (
    <View className="mx-4 mt-4 p-4 rounded-xl" style={{ backgroundColor: surface.card }}>
      <Text className="text-sm font-semibold mb-3" style={{ color: text.muted }}>
        Scan Information
      </Text>
      
      <View className="flex-row justify-between py-2 border-b" style={{ borderColor: border.light }}>
        <Text style={{ color: text.muted }}>ID</Text>
        <Text className="font-mono text-sm" style={{ color: text.dark }}>
          {scan.id}
        </Text>
      </View>
      
      <View className="flex-row justify-between py-2 border-b" style={{ borderColor: border.light }}>
        <Text style={{ color: text.muted }}>Type</Text>
        <Text className="font-medium" style={{ color: typeColor }}>
          {scan.type.toUpperCase()}
        </Text>
      </View>
      
      <View className="flex-row justify-between py-2 border-b" style={{ borderColor: border.light }}>
        <Text style={{ color: text.muted }}>Date Scanned</Text>
        <Text style={{ color: text.dark }}>
          {formatDate(new Date(scan.date))}
        </Text>
      </View>
      
      <View className="flex-row justify-between py-2">
        <Text style={{ color: text.muted }}>Favorite</Text>
        <Text style={{ color: text.dark }}>
          {scan.isFavorite ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
}