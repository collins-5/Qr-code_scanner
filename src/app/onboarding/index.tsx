import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PagerView from "react-native-pager-view";
import ScanIllustration from "../../../assets/onboarding/onboarding-scan.png";
import HistoryIllustration from "../../../assets/onboarding/onboarding-history.png";
import ShareIllustration from "../../../assets/onboarding/onboarding-share.png";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemePreference } from "@/hooks/use-theme-preference";

const { width } = Dimensions.get("window");

const ONBOARDING_KEY = "@onboarding_completed";

const slides = [
  {
    id: 1,
    title: "Scan QR Codes",
    description: "Point your camera at any QR code to instantly scan and read its content.",
    illustration: ScanIllustration,
  },
  {
    id: 2,
    title: "Save Your History",
    description: "All your scans are automatically saved so you never lose important information.",
    illustration: HistoryIllustration,
  },
  {
    id: 3,
    title: "Share with Ease",
    description: "Share scanned content as links or generate QR codes to share with others.",
    illustration: ShareIllustration,
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const { brand, surface, text, border } = useThemeColors();
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

  const illustrationSize = Math.min(width * 0.62, 260);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: surface.appGray }}>
      <View className="flex-1">
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
          {slides.map((slide) => (
            <View key={slide.id} className="flex-1 items-center justify-center px-8">
              <Image
                source={slide.illustration}
                style={{
                  width: illustrationSize,
                  height: illustrationSize,
                  marginBottom: 40,
                }}
                resizeMode="contain"
              />

              <Text
                className="text-3xl font-bold text-center mb-4"
                style={{ color: text.dark }}
              >
                {slide.title}
              </Text>

              <Text
                className="text-center text-lg leading-7 px-4"
                style={{ color: text.muted }}
              >
                {slide.description}
              </Text>
            </View>
          ))}
        </PagerView>

        <View className="px-8 pb-12">
          <View className="flex-row justify-center items-center space-x-2">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  currentPage === index ? "w-20" : "w-10"
                }`}
                style={{
                  backgroundColor: currentPage === index ? brand.primary : border.light,
                }}
              />
            ))}
          </View>

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