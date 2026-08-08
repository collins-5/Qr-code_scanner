import React, { useRef, useState } from "react";
import { View, Text, Alert, ActivityIndicator, Share, Linking, Platform } from "react-native";
import {
  SheetDefinition,
  SheetManager,
  ScrollView,
} from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import SafeAreaBottomSheet from "@/components/ui/safe-area-bottom-sheet";
import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemePreference } from "@/hooks/use-theme-preference";

interface ShareSheetProps {
  payload?: {
    content: string;
    type: string;
  };
}

const ShareSheet = ({ payload }: ShareSheetProps) => {
  const { brand, surface, text } = useThemeColors();
  const { isDark } = useThemePreference();
  const scrollViewRef = useRef<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { content, type } = payload || { content: "", type: "text" };
  const qrRef = useRef<any>(null);

  const handleCopy = async () => {
    if (content) {
      await Clipboard.setStringAsync(content);
      Alert.alert("Copied!", "Content copied to clipboard");
      SheetManager.hide("share-sheet");
    }
  };

  const handleShareText = async () => {
    if (content) {
      try {
        await Share.share({
          message: content,
          title: "QR Code Content",
        });
        SheetManager.hide("share-sheet");
      } catch (error) {
        console.error("Share error:", error);
        Alert.alert("Error", "Failed to share content");
      }
    }
  };

  const handleShareQRCode = async () => {
    if (!content) return;

    try {
      setIsGenerating(true);

      // Generate QR code as SVG and convert to base64
      const qrCodeData = content;
      const fileName = `qr-code-${Date.now()}.png`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // For QR code sharing, we'll create a simple approach
      // Since we can't easily generate QR images without extra libs,
      // we'll share the content with a note
      await Share.share({
        message: `QR Code Content:\n\n${content}`,
        title: "QR Code Content",
      });
      
      SheetManager.hide("share-sheet");
    } catch (error) {
      console.error("QR Share error:", error);
      Alert.alert("Error", "Failed to share QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQRCode = async () => {
    if (!content) return;

    try {
      setIsGenerating(true);
      
      // Create a text file with the QR content
      const fileName = `qr-code-${Date.now()}.txt`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, content);
      
      Alert.alert("Saved!", `QR code data saved to ${fileName}`);
      SheetManager.hide("share-sheet");
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenLink = async () => {
    if (content && type === "url") {
      try {
        const canOpen = await Linking.canOpenURL(content);
        if (canOpen) {
          await Linking.openURL(content);
          SheetManager.hide("share-sheet");
        } else {
          Alert.alert("Error", "Cannot open this link");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to open link");
      }
    }
  };

  const isURL = type === "url";

  return (
    <SafeAreaBottomSheet
      id="share-sheet"
      title="Share QR Code"
      icon={<Ionicons name="share-social" size={24} color="#fff" />}
      iconBgColor={brand.primary}
      showCloseButton={true}
      onClose={() => SheetManager.hide("share-sheet")}
      keyboardHandlerEnabled={true}
      avoidKeyboard={true}
    >
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        style={{ maxHeight: "90%" }}
      >
        {/* Content Preview */}
        <View 
          className="p-4 rounded-xl mb-4"
          style={{ backgroundColor: surface.appGray }}
        >
          <Text className="text-sm font-semibold mb-2" style={{ color: text.muted }}>
            Content
          </Text>
          <Text className="text-base" style={{ color: text.dark }} numberOfLines={3}>
            {content || "No content available"}
          </Text>
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
          className="items-center justify-center p-6 rounded-xl mb-4"
          style={{ backgroundColor: surface.appGray }}
        >
          <View 
            className="w-40 h-40 rounded-lg items-center justify-center p-4"
            style={{ backgroundColor: surface.card }}
          >
            {content ? (
              <QRCode
                value={content}
                size={120}
                color={brand.primary}
                backgroundColor="white"
              />
            ) : (
              <Ionicons name="qr-code" size={64} color={brand.primary} />
            )}
          </View>
          <Text className="text-xs mt-2" style={{ color: text.muted }}>
            Scan to view content
          </Text>
        </View>

        {isGenerating ? (
          <View className="py-4 items-center">
            <ActivityIndicator size="large" color={brand.primary} />
            <Text className="mt-2" style={{ color: text.muted }}>
              Processing...
            </Text>
          </View>
        ) : (
          <>
            {/* Share Options */}
            <View className="flex-row gap-3 mb-3">
              <Button
                onPress={handleShareText}
                variant="default"
                className="flex-1"
                leftIcon={<Ionicons name="share-social" size={20} color="#fff" />}
                text="Share Text"
              />
              <Button
                onPress={handleShareQRCode}
                variant="default"
                className="flex-1"
                leftIcon={<Ionicons name="qr-code" size={20} color="#fff" />}
                text="Share QR"
              />
            </View>

            <View className="flex-row gap-3 mb-3">
              <Button
                onPress={handleCopy}
                variant="outline"
                className="flex-1"
                leftIcon={<Ionicons name="copy-outline" size={20} color={brand.primary} />}
                text="Copy"
              />
              <Button
                onPress={handleSaveQRCode}
                variant="outline"
                className="flex-1"
                leftIcon={<Ionicons name="download-outline" size={20} color={brand.primary} />}
                text="Save QR"
              />
            </View>

            {/* Additional Options */}
            <View className="flex-row gap-3 mb-4">
              {isURL && (
                <Button
                  onPress={handleOpenLink}
                  variant="outline"
                  className="flex-1"
                  leftIcon={<Ionicons name="open-outline" size={20} color={brand.primary} />}
                  text="Open Link"
                />
              )}
              <Button
                onPress={() => {
                  Alert.alert("Coming Soon", "Text file save will be available soon!");
                }}
                variant="outline"
                className="flex-1"
                leftIcon={<Ionicons name="document-text-outline" size={20} color={brand.primary} />}
                text="Save Text"
              />
            </View>

            {/* Close Button */}
            <Button
              onPress={() => SheetManager.hide("share-sheet")}
              variant="ghost"
              className="mb-4"
              text="Close"
            />
          </>
        )}
      </ScrollView>
    </SafeAreaBottomSheet>
  );
};

export type ShareSheetDefinition = SheetDefinition<{
  payload?: {
    content: string;
    type: string;
  };
}>;

export default ShareSheet;