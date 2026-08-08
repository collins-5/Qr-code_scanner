import { View, Text, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { useState, useCallback, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useScanStore } from "@/stores/scanStore";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ScanList } from "@/components/history/scan-list";
import { EmptyState } from "@/components/history/empty-state";
import { HistoryHeader } from "@/components/history/history-header";
import { FILTERS, type FilterType } from "@/constants/filters";
import SwipeableTabs from "@/components/ui/swipeable-tabs";

type Timeout = ReturnType<typeof setTimeout>;

export default function HistoryScreen() {
  const { scans, deleteScan, clearHistory, toggleFavorite } = useScanStore();
  const { brand, surface } = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const deleteTimeoutRef = useRef<Timeout | null>(null);

  const getFilteredScans = useCallback(
    (type: FilterType) => {
      return type === "all" ? scans : scans.filter((scan) => scan.type === type);
    },
    [scans]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleScanPress = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/scan/${id}`);
  }, []);

  const handleDelete = useCallback(
    (id: string, content: string) => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        "Delete Scan",
        `Are you sure you want to delete this scan?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteScan(id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            },
          },
        ]
      );
    },
    [deleteScan]
  );

  const handleClearAll = useCallback(() => {
    if (scans.length === 0) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Clear History", "Are you sure you want to delete all scans?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => {
          clearHistory();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }, [scans.length, clearHistory]);

  const handleToggleFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [toggleFavorite]
  );

  const renderScanList = useCallback(
    (filter: FilterType) => {
      const filteredScans = getFilteredScans(filter);

      return (
        <ScanList
          data={filteredScans}
          onPress={handleScanPress}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={brand.primary}
              colors={[brand.primary]}
            />
          }
          ListEmptyComponent={EmptyState}
        />
      );
    },
    [
      getFilteredScans,
      handleScanPress,
      handleDelete,
      handleToggleFavorite,
      refreshing,
      onRefresh,
      brand.primary,
    ]
  );

  const tabs = FILTERS.map((filter) => ({
    key: filter.value,
    label: filter.label,
    badge: filter.value === "all" 
      ? scans.length 
      : scans.filter((s) => s.type === filter.value).length,
    component: renderScanList(filter.value),
  }));

  return (
    <View className="flex-1" style={{ backgroundColor: surface.appGray }}>
      <HistoryHeader
        scanCount={scans.length}
        onClearAll={handleClearAll}
      />
      <SwipeableTabs
        tabs={tabs}
        initialTab={filterType}
        onTabChange={(tabKey) => setFilterType(tabKey as FilterType)}
        headerClassName="bg-transparent"
        tabButtonClassName="py-3"
        activeTabClassName="font-semibold"
        usePagerView
        swipeEnabled
        showBadges
      />
    </View>
  );
}