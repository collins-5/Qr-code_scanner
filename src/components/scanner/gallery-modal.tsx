import { Modal } from "react-native";
import { GalleryImport } from "./gallery-import";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SafeAreaView } from "react-native-safe-area-context";

interface GalleryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function GalleryModal({ visible, onClose }: GalleryModalProps) {
  const { surface } = useThemeColors();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
    >
      <SafeAreaView className="flex-1" style={{ backgroundColor: surface.appGray }}>
        <GalleryImport onClose={onClose} />
      </SafeAreaView>
    </Modal>
  );
}