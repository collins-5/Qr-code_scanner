import { Stack, router } from "expo-router";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  type Theme,
} from "@react-navigation/native";
import { SheetProvider } from "react-native-actions-sheet";
import * as SystemUI from "expo-system-ui";
import {
  ThemePreferenceProvider,
  useThemePreference,
} from "@/hooks/use-theme-preference";
import { useThemeColors } from "@/hooks/useThemeColors";
import "@/components/ui/bottom-sheets";
import "../../global.css";

const ONBOARDING_KEY = "@onboarding_completed";

function ThemedRoot() {
  const [isReady, setIsReady] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const { isDark } = useThemePreference();
  const { brand, surface, text, border } = useThemeColors();
  const insets = useSafeAreaInsets();
  

  useEffect(() => {
    const prepare = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem(ONBOARDING_KEY);
        setIsOnboarded(onboardingStatus === "true");
      } catch (e) {
        console.warn("Error reading onboarding status:", e);
        setIsOnboarded(false);
      } finally {
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (isReady && isOnboarded !== null) {
      if (!isOnboarded) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isReady, isOnboarded]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(surface.appGray).catch(() => undefined);
  }, [surface.appGray]);

  const navigationTheme: Theme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    dark: isDark,
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: brand.primary,
      background: surface.appGray,
      card: surface.card,
      text: text.dark,
      border: border.light,
      notification: brand.primary,
    },
  };

  if (!isReady || isOnboarded === null) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: surface.appGray,
        }}
      >
        <ActivityIndicator size="large" color={brand.primary} />
      </SafeAreaView>
    );
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <SheetProvider>
          <StatusBar
            translucent
            backgroundColor={surface.header}
            barStyle={isDark ? "light-content" : "dark-content"}
          />
          <View style={{ flex: 1, paddingTop: insets.top}}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: brand.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "600",
              },
              headerBackTitle: "Back",
              animation: "slide_from_right",
              contentStyle: {
                backgroundColor: surface.appGray,
              },
            }}
          >
            <Stack.Screen
              name="onboarding"
              options={{
                headerShown: false,
                animation: "fade",
              }}
            />

            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="scan/[id]"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="modal/share"
              options={{
                presentation: "modal",
                title: "Share QR Code",
                headerBackTitle: "Cancel",
              }}
            />

            <Stack.Screen
              name="[...unmatched]"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          </View>
      </SheetProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemedRoot />
      </GestureHandlerRootView>
    </ThemePreferenceProvider>
  );
}
