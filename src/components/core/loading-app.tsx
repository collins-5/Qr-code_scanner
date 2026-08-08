import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import logo from "../../../assets/splash.png";

export function LoadingApp() {
  const { surface } = useThemeColors();

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: surface.appGray }}
    >
      <Image source={logo} resizeMode="contain" />
    </SafeAreaView>
  );
}