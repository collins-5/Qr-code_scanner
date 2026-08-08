import { View, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useScanStore } from "@/stores/scanStore";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ScanNotFound } from "@/components/scan/scan-not-found";
import { ScanHeader } from "@/components/scan/scan-header";
import { ScanContent } from "@/components/scan/scan-content";
import { ScanInfo } from "@/components/scan/scan-info";
import { ScanActions } from "@/components/scan/scan-actions";

export default function ScanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { scans,isLoading } = useScanStore();
  const { surface } = useThemeColors();

  const scan = scans.find((s) => s.id === id);

  if (!scan) {
    return <ScanNotFound id={id} />;
  }

  return (
    <ScrollView 
      className="flex-1" 
      style={{ backgroundColor: surface.appGray }}
      showsVerticalScrollIndicator={false}
    >
      <ScanHeader scan={scan} />
      <ScanContent scan={scan} />
      <ScanInfo scan={scan} />
      <ScanActions 
        scanId={scan.id} 
        content={scan.content}
        type={scan.type}
        qrImagePath={scan.qrImagePath}
      />
    </ScrollView>
  );
}