import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";

interface PermissionDeniedProps {
  onRequestPermission: () => void;
}

export function PermissionDenied({ onRequestPermission }: PermissionDeniedProps) {
  const { brand, surface, text } = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center p-5" style={{ backgroundColor: surface.appGray }}>
      <Ionicons name="camera-outline" size={64} color={brand.primary} />
      <Text className="text-xl font-semibold mt-5 mb-2.5" style={{ color: text.dark }}>
        Camera Permission Required
      </Text>
      <Text className="text-center mb-7.5" style={{ color: text.muted }}>
        This app needs camera access to scan QR codes. Please grant permission to continue.
      </Text>
      <TouchableOpacity
        onPress={onRequestPermission}
        className="px-10 py-3.5 rounded-xl"
        style={{ backgroundColor: brand.primary }}
      >
        <Text className="text-white text-base font-semibold">Grant Permission</Text>
      </TouchableOpacity>
    </View>
  );
}