import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { usePostHog } from "posthog-react-native";
import { Style } from "twrnc";

export default function HapticPressable({
  event,
  eventProps,
  children,
  style,
  ...props
}: {
  event: string;
  eventProps?: Record<string, any>;
  children: React.ReactNode;
  style?: Style | Style[];
  onPress: () => void;
}) {
  const posthog = usePostHog();

  return (
    <Pressable
      {...props}
      style={style}
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
    </Pressable>
  );
}
