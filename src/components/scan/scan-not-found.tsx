import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ScanNotFoundProps {
  id?: string;
}

export function ScanNotFound({ id }: ScanNotFoundProps) {
  const { brand, surface, text } = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center p-5" style={{ backgroundColor: surface.appGray }}>
      <Ionicons name="alert-circle-outline" size={64} color={text.muted} />
      <Text className="text-xl font-semibold mt-5" style={{ color: text.dark }}>
        Scan Not Found
      </Text>
      <Text className="text-center mt-2" style={{ color: text.muted }}>
        The scan you're looking for doesn't exist or has been deleted.
      </Text>
      {id && (
        <Text className="text-center mt-1 text-sm" style={{ color: text.muted }}>
          ID: {id}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => router.back()}
        className="mt-6 px-8 py-3 rounded-xl"
        style={{ backgroundColor: brand.primary }}
      >
        <Text className="text-white font-semibold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}