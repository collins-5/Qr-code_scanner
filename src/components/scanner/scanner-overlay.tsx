import { View, Text } from "react-native";
import { ReactNode } from "react";
import { ScannerHeader } from "@/components/scanner/scanner-header";

interface ScannerOverlayProps {
  torchOn: boolean;
  onToggleTorch: () => void;
  onGalleryPress: () => void;
  themeToggle: ReactNode;
  brandColor: string;
  showTorch?: boolean;
  showGallery?: boolean;
}

export function ScannerOverlay({
  torchOn,
  onToggleTorch,
  onGalleryPress,
  themeToggle,
  brandColor,
  showTorch = true,
  showGallery = true,
}: ScannerOverlayProps) {
  return (
    <View className="flex-1">
      {/* Header */}
      <ScannerHeader
        torchOn={torchOn}
        onToggleTorch={onToggleTorch}
        onGalleryPress={onGalleryPress}
        showTorch={showTorch}
        showGallery={showGallery}
      />

      {/* Scanning area */}
      <View className="flex-1 items-center justify-center">
        <View
          className="w-60 h-60 rounded-2xl bg-transparent relative border-2"
          style={{ borderColor: "rgba(255,255,255,0.8)" }}
        >
          {/* Corner markers */}
          <View
            className="absolute -top-0.5 -left-0.5 w-7.5 h-7.5 border-t-4 border-l-4 rounded-tl-lg"
            style={{ borderColor: brandColor }}
          />
          <View
            className="absolute -top-0.5 -right-0.5 w-7.5 h-7.5 border-t-4 border-r-4 rounded-tr-lg"
            style={{ borderColor: brandColor }}
          />
          <View
            className="absolute -bottom-0.5 -left-0.5 w-7.5 h-7.5 border-b-4 border-l-4 rounded-bl-lg"
            style={{ borderColor: brandColor }}
          />
          <View
            className="absolute -bottom-0.5 -right-0.5 w-7.5 h-7.5 border-b-4 border-r-4 rounded-br-lg"
            style={{ borderColor: brandColor }}
          />

          {/* Scanning line animation */}
          <View
            className="absolute top-0 left-5 right-5 h-0.5 opacity-80"
            style={{
              backgroundColor: brandColor,
              shadowColor: brandColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <View
              className="absolute -top-1 left-0 right-0 h-2.5 opacity-30 rounded"
              style={{ backgroundColor: brandColor }}
            />
          </View>
        </View>
      </View>

      {/* Bottom info */}
      <View className="p-7.5 items-center bg-transparent">
        <Text
          className="text-white text-sm font-medium px-5 py-2.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          Place QR code inside the frame
        </Text>
      </View>
    </View>
  );
}