import React, { useRef, useState } from "react";
import { View, Text, Alert, ActivityIndicator, Share, Linking } from "react-native";
import {
  SheetDefinition,
  SheetManager,
  ScrollView,
} from "react-native-actions-sheet";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { File } from "expo-file-system";
import QRCode from "react-native-qrcode-svg";
import SafeAreaBottomSheet from "@/components/ui/safe-area-bottom-sheet";
import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemePreference } from "@/hooks/use-theme-preference";

interface ShareSheetProps {
  payload?: {
    content: string;
    type: string;
    qrImagePath?: string;
  };
}

const ShareSheet = ({ payload }: ShareSheetProps) => {
  const { brand, surface, text } = useThemeColors();
  const { isDark } = useThemePreference();
  const scrollViewRef = useRef<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { content, type, qrImagePath } = payload || { content: "", type: "text" };
  const qrRef = useRef<any>(null);

  const generateQRPng = (fileName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!qrRef.current) {
        reject(new Error("QR code not ready"));
        return;
      }

      qrRef.current.toDataURL(async (base64: string) => {
        try {
          const fileUri = `${FileSystem.documentDirectory}${fileName}`;
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          resolve(fileUri);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const resolveQRPngUri = async (fileName: string): Promise<string> => {
    if (qrImagePath) {
      const file = new File(qrImagePath);
      if (file.exists) {
        return qrImagePath;
      }
    }
    return generateQRPng(fileName);
  };

  const handleShareQRAsPNG = async () => {
    if (!content) return;

    try {
      setIsGenerating(true);
      const fileUri = await resolveQRPngUri(`qr-share-${Date.now()}.png`);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/png",
          dialogTitle: "Share QR Code",
          UTI: "public.png",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }

      SheetManager.hide("share-sheet");
    } catch (error) {
      Alert.alert("Error", "Failed to share QR code as PNG");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareText = async () => {
    if (!content) return;

    try {
      await Share.share({
        message: `QR Code Content:\n\n${content}`,
        title: "QR Code Content",
      });
      SheetManager.hide("share-sheet");
    } catch (error) {
      Alert.alert("Error", "Failed to share content");
    }
  };

  const handleCopy = async () => {
    if (!content) return;

    try {
      await Clipboard.setStringAsync(content);
      Alert.alert("Copied!", "Content copied to clipboard");
      SheetManager.hide("share-sheet");
    } catch (error) {
      Alert.alert("Error", "Failed to copy content");
    }
  };

  const handleSaveQRCode = async () => {
    if (!content) return;

    try {
      setIsGenerating(true);
      const fileUri = await resolveQRPngUri(`qr-saved-${Date.now()}.png`);
      Alert.alert("Saved!", `QR code saved to:\n${fileUri}`);
      SheetManager.hide("share-sheet");
    } catch (error) {
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
      onClose={() => {
        SheetManager.hide("share-sheet");
      }}
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
          {qrImagePath && (
            <View className="mt-1">
              <Text className="text-xs" style={{ color: text.muted }}>
                QR Image: {qrImagePath.substring(qrImagePath.lastIndexOf("/") + 1)}
              </Text>
            </View>
          )}
        </View>

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
                getRef={(ref) => {
                  qrRef.current = ref;
                }}
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
              Generating...
            </Text>
          </View>
        ) : (
          <>
            <View className="flex-row gap-3 mb-3">
              <Button
                onPress={handleShareQRAsPNG}
                variant="default"
                className="flex-1"
                leftIcon={<Ionicons name="image-outline" size={20} color="#fff" />}
                text="Share QR (PNG)"
              />
              <Button
                onPress={handleShareText}
                variant="default"
                className="flex-1"
                leftIcon={<Ionicons name="share-social" size={20} color="#fff" />}
                text="Share Text"
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
            </View>

            <Button
              onPress={() => {
                SheetManager.hide("share-sheet");
              }}
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
    qrImagePath?: string;
  };
}>;

export default ShareSheet;