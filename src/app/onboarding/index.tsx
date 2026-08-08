import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PagerView from "react-native-pager-view";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemePreference } from "@/hooks/use-theme-preference";

const { width, height } = Dimensions.get("window");

const ONBOARDING_KEY = "@onboarding_completed";

const slides = [
  {
    id: 1,
    title: "Scan QR Codes",
    description: "Point your camera at any QR code to instantly scan and read its content.",
    icon: "scan",
  },
  {
    id: 2,
    title: "Save Your History",
    description: "All your scans are automatically saved so you never lose important information.",
    icon: "time",
  },
  {
    id: 3,
    title: "Share with Ease",
    description: "Share scanned content as links or generate QR codes to share with others.",
    icon: "share-social",
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const { brand, surface, text, border, tones } = useThemeColors();
  const { isDark } = useThemePreference();

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const renderPagination = () => {
    return (
      <View className="flex-row justify-center items-center space-x-2 mt-8">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              currentPage === index ? "w-8" : "w-2"
            }`}
            style={{
              backgroundColor: currentPage === index ? brand.primary : border.light,
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: surface.appGray }}>
      <View className="flex-1">
        {/* Skip button */}
        <TouchableOpacity
          onPress={handleSkip}
          className="absolute top-4 right-6 z-10 py-2 px-4"
        >
          <Text className="font-medium text-base" style={{ color: text.muted }}>
            Skip
          </Text>
        </TouchableOpacity>

        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {slides.map((slide, index) => {
            const gradientColors = [
              index === 0 ? brand.primary : index === 1 ? tones?.primary?.gradientStart || brand.primary : tones?.secondary?.gradientStart || brand.primary,
              index === 0 ? brand.primary + "CC" : index === 1 ? tones?.primary?.gradientEnd || brand.primary : tones?.secondary?.gradientEnd || brand.primary,
            ];
            
            return (
              <View key={slide.id} className="flex-1">
                <LinearGradient
                  colors={gradientColors as [string, string, ...string[]]}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: height * 0.55,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                  }}
                />

                <View className="flex-1 items-center justify-center px-8 pt-12">
                  {/* Icon */}
                  <View 
                    className="w-32 h-32 rounded-full items-center justify-center mb-8"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <Ionicons name={slide.icon as any} size={64} color="#fff" />
                  </View>

                  {/* Title */}
                  <Text className="text-3xl font-bold text-white text-center mb-4">
                    {slide.title}
                  </Text>

                  {/* Description */}
                  <Text className="text-white/90 text-center text-lg leading-7 px-4">
                    {slide.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </PagerView>

        {/* Bottom section with pagination and button */}
        <View className="px-8 pb-12" style={{ backgroundColor: surface.appGray }}>
          {/* Pagination dots */}
          <View className="flex-row justify-center items-center space-x-2">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  currentPage === index ? "w-8" : "w-2"
                }`}
                style={{
                  backgroundColor: currentPage === index ? brand.primary : border.light,
                }}
              />
            ))}
          </View>

          {/* Next/Get Started Button */}
          <TouchableOpacity
            onPress={handleNext}
            className="mt-8 py-4 px-6 rounded-full flex-row items-center justify-center"
            style={{ backgroundColor: brand.primary }}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg mr-2">
              {currentPage === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Ionicons
              name={currentPage === slides.length - 1 ? "checkmark" : "arrow-forward"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}