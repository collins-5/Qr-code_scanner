import { TouchableOpacity, View, Text, RefreshControlProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import List from "@/components/ui/list";
import { formatDate, getTypeIcon, getTypeColor, truncateContent } from "@/lib/utils/qrUtils";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Scan } from "@/stores/scanStore";

interface ScanListProps {
  data: Scan[];
  onPress: (id: string) => void;
  onDelete: (id: string, content: string) => void;
  onToggleFavorite: (id: string) => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function ScanList({
  data,
  onPress,
  onDelete,
  onToggleFavorite,
  refreshControl,
  ListEmptyComponent,
}: ScanListProps) {
  const { brand, surface, text } = useThemeColors();

  const handleShare = (content: string, type: string) => {
    SheetManager.show("share-sheet", {
      payload: {
        content: content,
        type: type,
      },
    });
  };

  const renderItem = ({ item }: { item: Scan }) => {
    const typeIcon = getTypeIcon(item.type);
    const typeColor = getTypeColor(item.type);

    return (
      <TouchableOpacity
        onPress={() => onPress(item.id)}
        onLongPress={() => onDelete(item.id, item.content)}
        className="flex-row items-center px-4 py-3 mx-4 my-1 rounded-xl"
        style={{ backgroundColor: surface.card }}
        activeOpacity={0.7}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: typeColor + "20" }}
        >
          <Ionicons name={typeIcon as any} size={20} color={typeColor} />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-medium" style={{ color: text.dark }} numberOfLines={1}>
            {truncateContent(item.content, 40)}
          </Text>
          <Text className="text-xs" style={{ color: text.muted }}>
            {formatDate(new Date(item.date))}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          {/* Share Button */}
          <TouchableOpacity
            onPress={() => handleShare(item.content, item.type)}
            className="p-1.5"
          >
            <Ionicons name="share-outline" size={18} color={text.muted} />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={() => onToggleFavorite(item.id)}
            className="p-1"
          >
            <Ionicons
              name={item.isFavorite ? "star" : "star-outline"}
              size={18}
              color={item.isFavorite ? brand.primary : text.muted}
            />
          </TouchableOpacity>

          {/* Chevron */}
          <Ionicons name="chevron-forward" size={18} color={text.muted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <List
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshControl={refreshControl}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
    />
  );
}