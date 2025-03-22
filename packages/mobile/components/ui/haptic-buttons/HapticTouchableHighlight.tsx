import { TouchableHighlight } from "react-native";
import * as Haptics from "expo-haptics";
import { usePostHog } from "posthog-react-native";

export default function HapticTouchableHightlight({
  event,
  eventProps,
  ...props
}: {
  event: string;
  eventProps?: Record<string, any>;
  onPress: () => void;
}) {
  const posthog = usePostHog();

  return (
    <TouchableHighlight
      {...props}
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
      }}
    />
  );
}
