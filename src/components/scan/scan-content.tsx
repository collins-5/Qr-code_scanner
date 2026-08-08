import { View, Text, TouchableOpacity, Alert, Linking, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Scan } from "@/stores/scanStore";
import Icon from "../ui/icon";

interface ScanContentProps {
  scan: Scan;
}

export function ScanContent({ scan }: ScanContentProps) {
  const { brand, surface, text } = useThemeColors();
  const isURL = scan.type === "url";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(scan.content);
    Alert.alert("Copied!", "Content copied to clipboard");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: scan.content,
        title: "QR Code Content",
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleOpenLink = async () => {
    if (isURL) {
      try {
        const canOpen = await Linking.canOpenURL(scan.content);
        if (canOpen) {
          await Linking.openURL(scan.content);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          Alert.alert("Error", "Cannot open this link");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to open link");
      }
    }
  };

  return (
    <View className="mx-4 mt-4 p-4 rounded-xl" style={{ backgroundColor: surface.card }}>
      <Text className="text-sm font-semibold mb-2" style={{ color: text.muted }}>
        Content
      </Text>
      <View className="p-3 rounded-lg" style={{ backgroundColor: surface.appGray }}>
        <Text className="text-base leading-6" style={{ color: text.dark }}>
          {scan.content}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2 mt-4">
        <Button
          variant="outline"
          rounded="lg"
          className="w-1/2"
          leftIcon={<Icon name="content-copy" size={24} color={brand.primary} />}
          text="Copy"
          textClassName="font-medium"
          style={{ borderColor: brand.primary + "40" }}
          onPress={handleCopy}
        />

        <Button
          variant="outline"
          rounded="lg"
          className="w-1/2"
          leftIcon={<Icon name="share-variant" size={24} color={brand.primary} />}
          text="Share"
          textClassName="font-medium"
          style={{ borderColor: brand.primary + "40" }}
          onPress={handleShare}
        />
      </View>

      {/* Open Link Button (only for URLs) */}
      {isURL && (
        <Button
          variant="default"
          rounded="lg"
          className="mt-2"
          leftIcon={<Icon name="open-in-new" size={24} color="#fff" />}
          text="Open Link"
          textClassName="font-medium text-white"
          onPress={handleOpenLink}
        />
      )}
    </View>
  );
}