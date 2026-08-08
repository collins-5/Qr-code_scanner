import React, { useRef } from 'react';
import { View, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import ActionSheet, {
  SheetDefinition,
  SheetProps,
} from 'react-native-actions-sheet';
import { Text as RNText } from 'react-native';
import { Button } from './button';
import { brand } from '@/lib/theme/colors';

interface SafeAreaBottomSheetProps {
  id: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBgColor?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  loading?: boolean;
  gestureEnabled?: boolean;
  closeOnTouchBackdrop?: boolean;
  keyboardHandlerEnabled?: boolean;
  customPaddingBottom?: number;
  avoidKeyboard?: boolean;
  // Snap points as percentages of screen height e.g. [50, 85]
  // Sheet opens at first snap point and can be dragged to others.
  // If not provided, sheet sizes to content as before.
  snapPoints?: number[];
  // Which snap point index to open at (default: 0 = first)
  initialSnapIndex?: number;
}

const SafeAreaBottomSheet: React.FC<SafeAreaBottomSheetProps> = ({
  id,
  children,
  title,
  subtitle,
  icon,
  iconColor = "#2E7D32",
  iconBgColor = "#E8F5E8",
  showCloseButton = true,
  onClose,
  loading = false,
  gestureEnabled = true,
  closeOnTouchBackdrop = true,
  keyboardHandlerEnabled = true,
  customPaddingBottom,
  avoidKeyboard = true,
  snapPoints,
  initialSnapIndex = 0,
}) => {
  const { surface, purple, text, border } = useThemeColors();
  const insets = useSafeAreaInsets();
  const actionSheetRef = useRef<any>(null);

  const handleClose = () => {
    Keyboard.dismiss();
    if (onClose) onClose();
  };

  return (
    <ActionSheet
      ref={actionSheetRef}
      id={id}
      gestureEnabled={!loading && gestureEnabled}
      closeOnTouchBackdrop={!loading && closeOnTouchBackdrop}
      backgroundInteractionEnabled={false}
      keyboardHandlerEnabled={keyboardHandlerEnabled}
      isModal={false}
      // Snap points — only applied when provided
      {...(snapPoints && snapPoints.length > 0
        ? {
            snapPoints,
            initialSnapIndex,
            // Required for snap points to work — sheet must fill its snap height
            defaultOverlayOpacity: 0.3,
          }
        : {})}
      containerStyle={{
        paddingBottom: customPaddingBottom !== undefined ? customPaddingBottom : insets.bottom,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: surface.card,
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
        elevation: 0,
      }}
      indicatorStyle={{ width: 50, height: 5, backgroundColor: brand.primaryDark }}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <View
          className="flex-row items-center justify-between px-6 pt-5 pb-4"
          style={{ borderBottomWidth: 1, borderBottomColor: border.medium }}
        >
          <View className="flex-row items-center gap-3">
            {icon && (
              <View
                className="w-11 h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: iconBgColor }}
              >
                {icon}
              </View>
            )}
            <View>
              {title && (
                <RNText className="text-lg font-bold" style={{ color: text.dark }}>{title}</RNText>
              )}
              {subtitle && (
                <RNText className="text-[13px] mt-0.5" style={{ color: text.muted }} numberOfLines={1}>
                  {subtitle}
                </RNText>
              )}
            </View>
          </View>

          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              onPress={handleClose}
              disabled={loading}
              iconProps={{ name: 'close', size: 22, color: text.dark }}
            />
          )}
        </View>
      )}

      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 0,
        }}
      >
        {children}
      </View>
    </ActionSheet>
  );
};

export default SafeAreaBottomSheet;