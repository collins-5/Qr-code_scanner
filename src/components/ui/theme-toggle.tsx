import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ThemeToggleProps {
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ size = 24, showLabel = false, className = "" }: ThemeToggleProps) {
  const { mode, setMode, isDark, resolvedScheme } = useThemePreference();
  const { brand, surface, text, border } = useThemeColors();

  const toggleTheme = () => {
    // Cycle between light and dark only
    const nextMode = isDark ? "light" : "dark";
    setMode(nextMode);
  };

  const getIconName = () => {
    return isDark ? "moon" : "sunny";
  };

  const getLabel = () => {
    return isDark ? "Dark" : "Light";
  };

  return (
    <Pressable
      onPress={toggleTheme}
      className={`flex-row items-center gap-2 px-3 py-2 rounded-full ${className}`}
      style={{
        backgroundColor: surface.card,
        borderWidth: 1,
        borderColor: border.light,
      }}
    >
      <Ionicons
        name={getIconName()}
        size={size}
        color={brand.primary}
      />
      {showLabel && (
        <Text className="text-sm font-medium" style={{ color: text.dark }}>
          {getLabel()}
        </Text>
      )}
    </Pressable>
  );
}