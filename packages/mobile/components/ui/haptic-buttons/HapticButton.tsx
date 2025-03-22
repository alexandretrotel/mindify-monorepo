import { Button } from "react-native";
import * as Haptics from "expo-haptics";
import { usePostHog } from "posthog-react-native";

export default function HapticButton({
  title,
  event,
  eventProps,
  ...props
}: {
  title: string;
  event: string;
  eventProps?: Record<string, any>;
  onPress: () => void;
}) {
  const posthog = usePostHog();

  return (
    <Button
      {...props}
      title={title}
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
