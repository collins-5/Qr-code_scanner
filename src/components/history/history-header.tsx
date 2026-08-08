import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";

interface HistoryHeaderProps {
  scanCount: number;
  onClearAll: () => void;
}

export function HistoryHeader({ scanCount, onClearAll }: HistoryHeaderProps) {
  const { surface, text } = useThemeColors();

  return (
    <View className="px-4 pb-3">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold" style={{ color: text.dark }}>
            History
          </Text>
          <Text className="text-sm" style={{ color: text.muted }}>
            {scanCount} {scanCount === 1 ? "scan" : "scans"} saved
          </Text>
        </View>
        {scanCount > 0 && (
          <TouchableOpacity
            onPress={onClearAll}
            className="p-2 rounded-lg"
            style={{ backgroundColor: surface.card }}
          >
            <Ionicons name="trash-outline" size={22} color={text.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}