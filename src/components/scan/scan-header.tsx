import { View, Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatDate, getTypeIcon, getTypeColor } from "@/lib/utils/qrUtils";
import { Scan } from "@/stores/scanStore";

interface ScanHeaderProps {
  scan: Scan;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

export function ScanHeader({ scan, onToggleFavorite, onDelete }: ScanHeaderProps) {
  const { brand, surface, text } = useThemeColors();
  const typeIcon = getTypeIcon(scan.type);
  const typeColor = getTypeColor(scan.type);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View className="px-4 pt-4 pb-2">
      <View className="flex-row items-center justify-between">
        {/* Back button and type info */}
        <View className="flex-row items-center flex-1">
          <Button
            variant="ghost"
            size="icon"
            rounded="full"
            onPress={handleBack}
            className="mr-2"
          >
            <Ionicons name="arrow-back" size={24} color={text.dark} />
          </Button>

          <View className="flex-row items-center">
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: typeColor + "20" }}
            >
              <Ionicons name={typeIcon as any} size={20} color={typeColor} />
            </View>
            <View>
              <Text className="text-lg font-bold" style={{ color: text.dark }}>
                {scan.type.toUpperCase()}
              </Text>
              <Text className="text-xs" style={{ color: text.muted }}>
                {formatDate(new Date(scan.date))}
              </Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View className="flex-row gap-2">
          <Button
            variant="ghost"
            size="icon"
            rounded="full"
            onPress={onToggleFavorite}
            className="p-2"
            style={{ backgroundColor: surface.card }}
          >
            <Ionicons 
              name={scan.isFavorite ? "star" : "star-outline"} 
              size={22} 
              color={scan.isFavorite ? brand.primary : text.muted} 
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            rounded="full"
            onPress={onDelete}
            className="p-2"
            style={{ backgroundColor: surface.card }}
          >
            <Ionicons name="trash-outline" size={22} color={text.muted} />
          </Button>
        </View>
      </View>
    </View>
  );
}