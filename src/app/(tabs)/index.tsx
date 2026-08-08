import { View, Text, Vibration, Alert } from "react-native";
import { useState, useEffect, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system/legacy";
import QRCode from "react-native-qrcode-svg";
import { useThemeColors } from "@/hooks/useThemeColors";
import { detectQRType } from "@/lib/utils/qrUtils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ScannerOverlay } from "@/components/scanner/scanner-overlay";
import { PermissionDenied } from "@/components/scanner/permission-denied";
import { useScanStore } from "@/stores/scanStore";

type Timeout = ReturnType<typeof setTimeout>;

interface PendingCapture {
  scanId: string;
  content: string;
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [pendingCapture, setPendingCapture] = useState<PendingCapture | null>(null);
  const { addScan, updateQRImagePath } = useScanStore();
  const { brand } = useThemeColors();
  const lastScannedRef = useRef<string | null>(null);
  const scanTimeoutRef = useRef<Timeout | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const qrRef = useRef<any>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!pendingCapture) return;

    const timeout = setTimeout(() => {
      qrRef.current?.toDataURL(async (base64: string) => {
        try {
          const fileUri = `${FileSystem.documentDirectory}qr-${pendingCapture.scanId}.png`;

          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await updateQRImagePath(pendingCapture.scanId, fileUri);
        } catch (error) {
          console.error("Failed to save QR image:", error);
        } finally {
          setPendingCapture(null);
        }
      });
    }, 50);

    return () => clearTimeout(timeout);
  }, [pendingCapture]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (isProcessingRef.current || lastScannedRef.current === data || scanned) {
      return;
    }

    isProcessingRef.current = true;
    setScanned(true);
    lastScannedRef.current = data;

    Vibration.vibrate(100);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const type = detectQRType(data);

    const scanId = await addScan({ content: data, type });
    setPendingCapture({ scanId, content: data });

    router.push(`/scan/${scanId}`);

    scanTimeoutRef.current = setTimeout(() => {
      setScanned(false);
      lastScannedRef.current = null;
      isProcessingRef.current = false;
    }, 2000);
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGalleryPress = () => {
    Alert.alert("Coming Soon", "Gallery import will be available soon!");
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center">
      </View>
    );
  }

  if (!permission.granted) {
    return <PermissionDenied onRequestPermission={requestPermission} />;
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        enableTorch={torchOn}
      >
        <ScannerOverlay
          torchOn={torchOn}
          onToggleTorch={toggleTorch}
          onGalleryPress={handleGalleryPress}
          themeToggle={<ThemeToggle size={22} />}
          brandColor={brand.primary}
        />
      </CameraView>

      {pendingCapture && (
        <View style={{ position: "absolute", top: -9999, left: -9999 }}>
          <QRCode
            value={pendingCapture.content}
            size={300}
            color={brand.primary}
            backgroundColor="white"
            getRef={(ref) => {
              qrRef.current = ref;
            }}
          />
        </View>
      )}
    </View>
  );
}