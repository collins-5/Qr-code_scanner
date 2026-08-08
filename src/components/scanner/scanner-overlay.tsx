import { View, Text, Animated, Easing } from "react-native";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ScannerHeader } from "@/components/scanner/scanner-header";

interface QRBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ScannerOverlayProps {
  torchOn: boolean;
  onToggleTorch: () => void;
  onGalleryPress: () => void;
  themeToggle: ReactNode;
  brandColor: string;
  showTorch?: boolean;
  showGallery?: boolean;
  qrBounds?: QRBounds | null;
}

const DEFAULT_FRAME_SIZE = 240;
const FRAME_PADDING = 28;
const MASK_COLOR = "rgba(0,0,0,0.55)";

export function ScannerOverlay({
  torchOn,
  onToggleTorch,
  onGalleryPress,
  themeToggle,
  brandColor,
  showTorch = true,
  showGallery = true,
  qrBounds,
}: ScannerOverlayProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const boxX = useRef(new Animated.Value(0)).current;
  const boxY = useRef(new Animated.Value(0)).current;
  const boxW = useRef(new Animated.Value(DEFAULT_FRAME_SIZE)).current;
  const boxH = useRef(new Animated.Value(DEFAULT_FRAME_SIZE)).current;
  const scanLine = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const isTracking = !!qrBounds;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(scanLine, {
        toValue: 1,
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [scanLine]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    const target = qrBounds
      ? {
          x: Math.max(0, qrBounds.x - FRAME_PADDING),
          y: Math.max(0, qrBounds.y - FRAME_PADDING),
          width: Math.min(containerSize.width, qrBounds.width + FRAME_PADDING * 2),
          height: Math.min(containerSize.height, qrBounds.height + FRAME_PADDING * 2),
        }
      : {
          x: (containerSize.width - DEFAULT_FRAME_SIZE) / 2,
          y: (containerSize.height - DEFAULT_FRAME_SIZE) / 2,
          width: DEFAULT_FRAME_SIZE,
          height: DEFAULT_FRAME_SIZE,
        };

    Animated.parallel([
      Animated.spring(boxX, { toValue: target.x, useNativeDriver: false, speed: 14, bounciness: 6 }),
      Animated.spring(boxY, { toValue: target.y, useNativeDriver: false, speed: 14, bounciness: 6 }),
      Animated.spring(boxW, { toValue: target.width, useNativeDriver: false, speed: 14, bounciness: 6 }),
      Animated.spring(boxH, { toValue: target.height, useNativeDriver: false, speed: 14, bounciness: 6 }),
    ]).start();
  }, [qrBounds, containerSize]);

  const frameOpacity = isTracking
    ? 1
    : pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  const scanLineTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [10, DEFAULT_FRAME_SIZE - 30],
  });

  return (
    <View className="flex-1">
      <ScannerHeader
        torchOn={torchOn}
        onToggleTorch={onToggleTorch}
        onGalleryPress={onGalleryPress}
        showTorch={showTorch}
        showGallery={showGallery}
      />

      <View
        className="flex-1"
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setContainerSize({ width, height });
        }}
      >
        {containerSize.width > 0 && (
          <>
            <Animated.View
              pointerEvents="none"
              style={{ position: "absolute", top: 0, left: 0, right: 0, height: boxY, backgroundColor: MASK_COLOR }}
            />
            <Animated.View
              pointerEvents="none"
              style={{ position: "absolute", left: 0, top: boxY, width: boxX, height: boxH, backgroundColor: MASK_COLOR }}
            />
            <Animated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: Animated.add(boxX, boxW),
                top: boxY,
                right: 0,
                height: boxH,
                backgroundColor: MASK_COLOR,
              }}
            />
            <Animated.View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: Animated.add(boxY, boxH),
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: MASK_COLOR,
              }}
            />

            <Animated.View
              style={{
                position: "absolute",
                left: boxX,
                top: boxY,
                width: boxW,
                height: boxH,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: isTracking ? brandColor : "rgba(255,255,255,0.55)",
                opacity: frameOpacity,
              }}
            >
              <View
                className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl"
                style={{ borderColor: brandColor }}
              />
              <View
                className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 rounded-tr-2xl"
                style={{ borderColor: brandColor }}
              />
              <View
                className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 rounded-bl-2xl"
                style={{ borderColor: brandColor }}
              />
              <View
                className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl"
                style={{ borderColor: brandColor }}
              />

              {!isTracking && (
                <Animated.View
                  className="absolute left-4 right-4 h-0.5 rounded-full"
                  style={{
                    backgroundColor: brandColor,
                    shadowColor: brandColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.9,
                    shadowRadius: 8,
                    elevation: 5,
                    transform: [{ translateY: scanLineTranslate }],
                  }}
                />
              )}
            </Animated.View>
          </>
        )}
      </View>

      <View className="p-7 items-center">
        <View
          className="px-5 py-2.5 rounded-full"
          style={{ backgroundColor: isTracking ? brandColor : "rgba(0,0,0,0.5)" }}
        >
          <Text className="text-white text-sm font-medium">
            {isTracking ? "QR code detected" : "Point your camera at a QR code"}
          </Text>
        </View>
      </View>
    </View>
  );
}