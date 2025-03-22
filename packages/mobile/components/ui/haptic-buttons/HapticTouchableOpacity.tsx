import { TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { usePostHog } from "posthog-react-native";
import { Style } from "twrnc";

export default function HapticTouchableOpacity({
  event,
  eventProps,
  children,
  style,
  disabled,
  activeOpacity,
  ...props
}: {
  event: string;
  eventProps?: Record<string, any>;
  children: React.ReactNode;
  onPress: () => void;
  style?: Style | Style[];
  activeOpacity?: number;
  disabled?: boolean;
}) {
  const posthog = usePostHog();

  return (
    <TouchableOpacity
      {...props}
      style={style}
      disabled={disabled}
      activeOpacity={activeOpacity}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (posthog.optedOut === false) {
          if (eventProps) {
            posthog.capture(event, eventProps);
          } else {
            posthog.capture(event);
          }
        }

        if (props.onPress) {
          props.onPress();
        }
      }}>
      {children}
    </TouchableOpacity>
  );
}
