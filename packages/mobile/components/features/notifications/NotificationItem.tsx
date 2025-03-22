import React from "react";
import type { Tables } from "@/types/supabase";
import NotificationContent from "@/components/features/notifications/NotificationContent";
import useNotificationActions from "@/hooks/features/notifications/useNotificationActions";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";
import { View } from "react-native";

function NotificationItem({
  notification,
}: Readonly<{
  notification: Tables<"notifications">;
}>) {
  const { colorStyles } = useTheme();

  const { showActionSheet } = useNotificationActions(notification);

  return (
    <View style={[colorStyles.bgBackground, tw`flex px-4 py-2 w-full`]}>
      <NotificationContent notification={notification} showActionSheet={showActionSheet} />
    </View>
  );
}

export default React.memo(NotificationItem);
