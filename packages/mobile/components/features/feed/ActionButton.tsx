import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { View } from "react-native";
import AnimateNumber from "react-native-animate-number";

const ActionButton = ({
  icon: Icon,
  color,
  fillColor,
  count,
  onPress,
  event,
  eventProps,
}: {
  icon: React.ComponentType<any>;
  color: string;
  fillColor: string;
  count?: number;
  onPress: () => void;
  event: string;
  eventProps: Record<string, any>;
}) => {
  const { colorStyles } = useTheme();

  if (count === undefined) {
    return (
      <View style={tw`flex-col gap-2 items-center`}>
        <HapticTouchableOpacity onPress={onPress} event={event} eventProps={eventProps}>
          <Icon size={32} color={color} fill={fillColor} />
        </HapticTouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-col gap-2 items-center`}>
      <HapticTouchableOpacity onPress={onPress} event={event} eventProps={eventProps}>
        <Icon size={32} color={color} fill={fillColor} />
      </HapticTouchableOpacity>

      <ThemedText style={[colorStyles.textWhite, tw`text-sm`]} semibold>
        {count > 0 ? <AnimateNumber countBy={1} value={count} /> : count}
      </ThemedText>
    </View>
  );
};

export default ActionButton;
