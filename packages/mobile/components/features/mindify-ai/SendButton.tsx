import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { Loader2Icon, SendIcon } from "lucide-react-native";
import { useMemo } from "react";
import { Animated, View } from "react-native";

export default function SendButton({
  loading,
  inputMessage,
  handleSendMessage,
  rotate,
  disabled,
}: {
  loading: boolean;
  inputMessage: string;
  handleSendMessage: (inputMessage: string) => void;
  rotate: Animated.AnimatedInterpolation<string | number>;
  disabled: boolean;
}) {
  const { colors, colorStyles } = useTheme();

  const globalDisabled = useMemo(() => {
    const localDisabled: boolean = inputMessage.trim().length === 0 || disabled || loading;
    return localDisabled;
  }, [disabled, inputMessage, loading]);

  return (
    <HapticTouchableOpacity
      onPress={() => handleSendMessage(inputMessage)}
      event="user_sent_message_to_ai"
      disabled={globalDisabled}>
      <View
        style={[
          tw.style(
            `p-4 rounded-md flex-1 items-center justify-center flex`,
            globalDisabled && `opacity-50`,
          ),
          colorStyles.bgForeground,
        ]}>
        {loading ? (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Loader2Icon size={24} color={colors.background} />
          </Animated.View>
        ) : (
          <View style={tw`flex-row items-center justify-center text-center`}>
            <SendIcon size={24} color={colors.background} />
          </View>
        )}
      </View>
    </HapticTouchableOpacity>
  );
}
