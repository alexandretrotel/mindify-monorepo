import { useTheme } from "@/providers/ThemeProvider";
import { ActivityIndicator } from "react-native";

export default function ThemedActivityIndicator() {
  const { colors } = useTheme();

  return <ActivityIndicator color={colors.foreground} />;
}
