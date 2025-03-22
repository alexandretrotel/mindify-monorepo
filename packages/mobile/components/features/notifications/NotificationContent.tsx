import ThemedText from "@/components/typography/ThemedText";
import type { Tables } from "@/types/supabase";
import { formatDistanceToNow, parseISO } from "date-fns";
import { View } from "react-native";
import { fr } from "date-fns/locale";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";

export default function NotificationContent({
  notification,
  showActionSheet,
}: Readonly<{
  notification: Tables<"notifications">;
  showActionSheet: () => void;
}>) {
  const { colorStyles } = useTheme();

  return (
    <HapticTouchableOpacity
      onPress={showActionSheet}
      event="user_pressed_notification"
      eventProps={{
        notification_id: notification.id,
        notification_title: notification.title,
        notification_message: notification.message,
      }}>
      <View style={tw`flex flex-row items-center gap-2`}>
        <ThemedText semibold style={[colorStyles.textForeground, tw`text-sm`]}>
          {notification.title}
        </ThemedText>
        {!notification.is_read && (
          <View style={[colorStyles.bgDestructive, tw`rounded-full w-2 h-2`]} />
        )}
      </View>

      <ThemedText style={[colorStyles.textForeground, tw`text-sm`]}>
        {notification.message}
      </ThemedText>
      <ThemedText style={[colorStyles.textMutedForeground, tw`text-xs mt-2`]}>
        {formatDistanceToNow(parseISO(notification.created_at), {
          locale: fr,
          addSuffix: true,
        })}
      </ThemedText>
    </HapticTouchableOpacity>
  );
}
