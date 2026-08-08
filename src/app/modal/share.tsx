import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemePreference } from "@/hooks/use-theme-preference";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export default function ShareModal() {
  const { content, type } = useLocalSearchParams<{ content: string; type: string }>();
  const { brand, surface, text, border } = useThemeColors();
  const { isDark } = useThemePreference();

  const handleCopy = async () => {
    if (content) {
      await Clipboard.setStringAsync(content);
      Alert.alert("Copied!", "Content copied to clipboard");
    }
  };

  const handleShare = async () => {
    if (content) {
      try {
        await Sharing.shareAsync(content, {
          mimeType: "text/plain",
          dialogTitle: "Share QR Content",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to share content");
      }
    }
  };

  const handleSave = async () => {
    // Example: Save QR code as image
    Alert.alert("Coming Soon", "Save QR code feature coming soon!");
  };

  const handleEmail = () => {
    Alert.alert("Coming Soon", "Email feature coming soon!");
  };

  return (
    <View className="flex-1 p-5" style={{ backgroundColor: surface.appGray }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 pt-4">
        <Text className="text-xl font-bold" style={{ color: text.dark }}>
          Share QR Code
        </Text>
        <Button
          variant="ghost"
          size="icon"
          rounded="full"
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color={text.dark} />
        </Button>
      </View>

      {/* Content Preview */}
      <View 
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: surface.card }}
      >
        <Text className="text-sm font-semibold mb-2" style={{ color: text.muted }}>
          Content
        </Text>
        <View 
          className="p-3 rounded-lg"
          style={{ backgroundColor: surface.appGray }}
        >
          <Text className="text-base" style={{ color: text.dark }} numberOfLines={3}>
            {content || "No content available"}
          </Text>
        </View>
        {type && (
          <View className="mt-2">
            <Text className="text-xs" style={{ color: text.muted }}>
              Type: {type.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* QR Code Preview */}
      <View 
        className="items-center justify-center p-6 rounded-xl mb-6"
        style={{ backgroundColor: surface.card }}
      >
        <View 
          className="w-40 h-40 rounded-lg items-center justify-center"
          style={{ backgroundColor: surface.appGray }}
        >
          <Ionicons name="qr-code" size={72} color={brand.primary} />
        </View>
      </View>

      {/* Share Options */}
      <View className="flex-row gap-3 mb-6">
        <Button
          variant="default"
          size="default"
          rounded="lg"
          className="flex-1"
          leftIcon={<Ionicons name="share-social" size={20} color="#fff" />}
          text="Share"
          textClassName="text-white font-medium"
          onPress={handleShare}
        />

        <Button
          variant="outline"
          size="default"
          rounded="lg"
          className="flex-1"
          leftIcon={<Ionicons name="download-outline" size={20} color={brand.primary} />}
          text="Save"
          textClassName="font-medium"
          onPress={handleSave}
        />
      </View>

      {/* Additional Options */}
      <View className="flex-row gap-3">
        <Button
          variant="outline"
          size="default"
          rounded="lg"
          className="flex-1"
          leftIcon={<Ionicons name="copy-outline" size={20} color={brand.primary} />}
          text="Copy"
          textClassName="font-medium"
          onPress={handleCopy}
        />

        <Button
          variant="outline"
          size="default"
          rounded="lg"
          className="flex-1"
          leftIcon={<Ionicons name="mail-outline" size={20} color={brand.primary} />}
          text="Email"
          textClassName="font-medium"
          onPress={handleEmail}
        />
      </View>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="default"
        rounded="lg"
        className="mt-6"
        text="Close"
        textClassName="font-medium"
        onPress={() => router.back()}
      />
    </View>
  );
}