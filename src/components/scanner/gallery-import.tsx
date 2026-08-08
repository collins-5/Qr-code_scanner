import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useScanStore } from "@/stores/scanStore";
import { detectQRType } from "@/lib/utils/qrUtils";
import * as Haptics from "expo-haptics";

interface GalleryImportProps {
  onClose: () => void;
}

export function GalleryImport({ onClose }: GalleryImportProps) {
  const { brand, surface, text, border } = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addScan } = useScanStore();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please grant permission to access your gallery");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        await processQRCode(uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const processQRCode = async (imageUri: string) => {
    setLoading(true);
    try {
      // Read image as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // For now, we'll simulate QR code detection
      // In a real implementation, you'd use a QR code decoding library
      // like react-native-qrcode-decoder or similar
      
      // Simulate QR code detection with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate detecting a QR code
      const detectedContent = "https://example.com";
      const type = detectQRType(detectedContent);
      const scanId = Date.now().toString();
      
      Alert.alert(
        "QR Code Detected",
        `Found QR code: ${detectedContent}`,
        [
          { text: "Cancel", style: "cancel", onPress: onClose },
          {
            text: "Process",
            onPress: async () => {
              await addScan({
                content: detectedContent,
                type: type,
              });
              
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.push(`/scan/${scanId}`);
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error processing QR code:", error);
      Alert.alert("Error", "Failed to process QR code from image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4" style={{ backgroundColor: surface.appGray }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold" style={{ color: text.dark }}>
          Import from Gallery
        </Text>
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color={text.dark} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={brand.primary} />
          <Text className="mt-4" style={{ color: text.muted }}>
            Processing QR code...
          </Text>
        </View>
      ) : selectedImage ? (
        <View className="flex-1">
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-64 rounded-xl"
            resizeMode="contain"
          />
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={pickImage}
              className="flex-1 py-3 rounded-xl items-center"
              style={{ backgroundColor: brand.primary }}
            >
              <Text className="text-white font-medium">Choose Another</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-xl items-center"
              style={{ backgroundColor: surface.card, borderWidth: 1, borderColor: border.light }}
            >
              <Text className="font-medium" style={{ color: text.dark }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <TouchableOpacity
            onPress={pickImage}
            className="w-32 h-32 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: brand.primary + "20" }}
          >
            <Ionicons name="images-outline" size={48} color={brand.primary} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold" style={{ color: text.dark }}>
            No Image Selected
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: text.muted }}>
            Tap the button above to select an image from your gallery
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            className="mt-6 px-8 py-3 rounded-xl"
            style={{ backgroundColor: brand.primary }}
          >
            <Text className="text-white font-medium">Select Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}