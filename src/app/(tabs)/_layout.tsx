import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View, SafeAreaView } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { brand, surface, text, border } = useThemeColors();
  const { isDark } = useThemePreference();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: brand.primary,
        tabBarInactiveTintColor: text.muted,
        tabBarStyle: {
          backgroundColor: surface.card,
          borderTopWidth: 1,
          borderTopColor: border.light,
          height: Platform.OS === "ios" 
            ? 88 + insets.bottom 
            : 60 + insets.bottom,
          paddingBottom: Platform.OS === "ios" 
            ? 28 + insets.bottom 
            : 8 + insets.bottom,
          paddingTop: 8,
          paddingHorizontal: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: brand.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scanner",
          tabBarLabel: "Scanner",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}