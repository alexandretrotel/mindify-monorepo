import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";

export default function ReadUnreadButton({
  isRead,
  onPress,
}: Readonly<{
  isRead: boolean;
  onPress: () => void;
}>) {
  const { colorStyles } = useTheme();

  return (
    <HapticTouchableOpacity
      onPress={onPress}
      event="user_toggled_read_status"
      style={[
        isRead ? colorStyles.bgDestructive : colorStyles.bgPrimary,
        tw.style(`justify-center items-center flex h-full w-24`),
      ]}>
      {isRead ? <EyeOffIcon size={24} color="white" /> : <EyeIcon size={24} color="white" />}
    </HapticTouchableOpacity>
  );
}
