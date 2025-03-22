import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { XIcon } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ModalHeader({ name, onClose }: { name: string; onClose?: () => void }) {
  const { colorStyles, colors } = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        tw`flex-row items-center justify-between border-b px-4 py-2`,
        colorStyles.border,
        colorStyles.bgCard,
        { paddingTop: safeAreaInsets.top },
      ]}>
      <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
        {name}
      </ThemedText>

      <HapticTouchableOpacity
        style={tw`p-2 rounded-full`}
        event="user_dismissed_login_screen"
        onPress={() => onClose?.()}>
        <XIcon size={24} color={colors.foreground} />
      </HapticTouchableOpacity>
    </View>
  );
}
