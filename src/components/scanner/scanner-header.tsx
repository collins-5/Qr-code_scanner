import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ScannerHeaderProps {
  torchOn: boolean;
  onToggleTorch: () => void;
  onGalleryPress: () => void;
  showTorch?: boolean;
  showGallery?: boolean;
}

export function ScannerHeader({
  torchOn,
  onToggleTorch,
  onGalleryPress,
  showTorch = true,
  showGallery = true,
}: ScannerHeaderProps) {
  return (
    <View className="flex-row justify-between items-start px-5 pt-4 pb-5 bg-transparent">
      <View />
      <View className="flex-row items-center gap-3">
        <ThemeToggle size={22} />
        {showTorch && (
          <TouchableOpacity
            onPress={onToggleTorch}
            className="p-3 rounded-full border border-white/20"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <Ionicons
              name={torchOn ? "flash" : "flash-outline"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        )}
        {showGallery && (
          <TouchableOpacity
            onPress={onGalleryPress}
            className="p-3 rounded-full border border-white/20"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <Ionicons name="images-outline" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
