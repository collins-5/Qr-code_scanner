import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ImageProps } from "expo-image";
import { Text as RNText } from "react-native";
import { cn } from "@/lib/utils";
import { text } from "@/lib/theme/colors";

export type IconNames = Extract<
  keyof typeof MaterialCommunityIcons.glyphMap,
  | "magnify"
  | "information-outline"
  | "eye-outline"
  | "eye-off-outline"
  | "check"
  | "filter-variant"
  | "timetable"
  | "arrow-left"
  | "arrow-right"
  | "chevron-up"
  | "account-multiple-plus"
  | "bell"
  | "chevron-down"
  | "card-account-details"
  | "chevron-left"
  | "chevron-right"
  | "share-variant-outline"
  | "heart-outline"
  | "heart"
  | "map-marker-radius-outline"
  | "close"
  | "close-circle"
  | "earth"
  | "arrow-top-right"
  | "alert-outline"
  | "alert-circle-outline"
  | "download"
  | "download-outline"
  | "dots-vertical"
  | "dots-horizontal"
  | "file-outline"
  | "filter-outline"
  | "folder-plus-outline"
  | "folder"
  | "email-outline"
  | "emoticon-outline"
  | "account-edit"
  | "phone-outline"
  | "phone-alert"
  | "lock-outline"
  | "lock-reset"
  | "check-bold"
  | "loading"
  | "home-variant-outline"
  | "folder-text-outline"
  | "star"
  | "star-outline"
  | "star-half-full"
  | "cog-outline"
  | "account-switch-outline"
  | "account-outline"
  | "calendar"
  | "calendar-edit"
  | "calendar-plus"
  | "calendar-remove"
  | "clock-outline"
  | "cart-plus"
  | "delete-outline"
  | "check-circle-outline"
  | "account-cog-outline"
  | "email-open-outline"
  | "video-plus-outline"
  | "video-outline"
  | "receipt"
  | "send"
  | "pulse"
  | "cash"
  | "access-point"
  | "clipboard-list-outline"
  | "clipboard-check-outline"
  | "clipboard-account-outline"
  | "content-copy"
  | "keyboard"
  | "pin"
  | "close-circle-outline"
  | "account-group"
  | "account-question"
  | "food-apple"
  | "arm-flex"
  | "brain"
  | "clipboard-text"
  | "wheelchair-accessibility"
  | "shield-check-outline"
  | "home-heart"
  | "shield-outline"
  | "account-injury"
  | "nutrition"
  | "mother-nurse"
  | "human-wheelchair"
  | "plus-box-outline"
  | "file-lock-outline"
  | "bell-outline"
  | "comment-alert-outline"
  | "image"
  | "camera"
  | "share-variant"
  | "calendar-clock"
  | "bookmark-outline"
  | "bookmark"
  | "upload"
  | "paperclip"
  | "plus"
  | "message-outline"
  | "view-list"
  | "view-module"
  | "microphone"
  | "microphone-off"
  | "attachment"
  | "account-plus-outline"
  | "gender-male-female"
  | "logout"
  | "help-circle-outline"
  | "account"
  | "robot"
  | "credit-card-outline"
  | "home-outline"
  | "newspaper-variant-multiple"
  | "user"
  | "mail"
  | "play-circle"
  | "play"
  | "wifi"
  | "home"
  | "bell-off"
  | "gift"
  | "credit-card"
  | "clock-outline"
  | "calendar-outline"
  | "phone"
  | "wallet"
  | "chart-bar"
  | "youtube"
  | "pencil"
  | "pencil-plus-outline"
  | "brightness-6"
  | "calendar-check"
  | "star-half"
  | "trash-can-outline"
  | "book-open-variant"
  | "github"
  | "rocket-launch"
  | "shield-check"
  | "apple"
  | "google"
  | "lock-check-outline"
  | "check-circle"
  | "menu"
  | "bus-clock"
  | "book-open-page-variant-outline"
  | "notebook-outline"
  | "open-in-new"
>;

type ImageIconProps = {
  name: IconNames;
  size?: number;
  className?: string;
  color?: string;
};

export type IconProps = ImageIconProps | ImageProps;

export default function Icon({ className, ...props }: IconProps) {
  const isVectorIcon = "name" in props;
  const isImageIcon = "source" in props;

  // @ts-ignore TODO: Try fix this typescript error
  const { width = 24, height = 24 } = props;

  if (isVectorIcon) {
    const { color: propColor, size = 24, name, ...rest } = props as ImageIconProps;
    
    return (
      <RNText
        className={cn(className)}
        style={{ 
          backgroundColor: 'transparent', 
          lineHeight: size,
        }}
      >
        <MaterialCommunityIcons 
          name={name}
          size={size}
          color={propColor || text.gray}
          {...rest}
        />
      </RNText>
    );
  }

  if (isImageIcon) {
    return (
      <Image
        {...(props as ImageProps)}
        style={{
          width,
          height,
        }}
      />
    );
  }

  return null;
}