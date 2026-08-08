import { View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import { Button } from "@/components/ui/button";
import { useScanStore } from "@/stores/scanStore";

interface ScanActionsProps {
  scanId: string;
  content?: string;
  type?: string;
}

export function ScanActions({ scanId, content, type }: ScanActionsProps) {
  const { deleteScan } = useScanStore();

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Delete Scan",
      "Are you sure you want to delete this scan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteScan(scanId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          },
        },
      ]
    );
  };

  const handleShareSheet = () => {
    if (content) {
      SheetManager.show("share-sheet", {
        payload: {
          content: content,
          type: type || "text",
        },
      });
    }
  };

  return (
    <View className="mx-4 mt-6 mb-8">
      {/* Share Button */}
      {content && (
        <Button
          variant="default"
          size="default"
          rounded="xl"
          className="mb-3"
          leftIcon={<Ionicons name="share-social" size={20} color="#fff" />}
          text="Share QR Code"
          textClassName="font-medium text-white"
          onPress={handleShareSheet}
        />
      )}
      
      {/* Delete Button */}
      <Button
        variant="destructive"
        size="default"
        rounded="xl"
        leftIcon={<Ionicons name="trash-outline" size={20} color="#fff" />}
        text="Delete Scan"
        textClassName="font-medium text-white"
        onPress={handleDelete}
      />
    </View>
  );
}