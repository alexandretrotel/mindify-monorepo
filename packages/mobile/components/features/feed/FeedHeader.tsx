import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { useRouter } from "expo-router";
import { BellIcon, SearchIcon } from "lucide-react-native";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { memo } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/constants/colors";
import tw from "@/lib/tailwind";

const FeedHeader = ({ unreadCount }: { unreadCount: number }) => {
  const safeInsets = useSafeAreaInsets();
  const { colorStyles } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[
        colorStyles.bgTransparent,
        {
          paddingTop: Platform.OS === "android" ? safeInsets.top + 16 : safeInsets.top,
        },
        tw`px-4 absolute top-0 inset-x-0`,
      ]}>
      <View style={tw`flex flex-row justify-between items-center gap-4`}>
        <ThemedText style={[colorStyles.textWhite, tw`text-2xl`]} semibold>
          Mindify
        </ThemedText>

        <View style={tw`flex flex-row items-center gap-4`}>
          <HapticTouchableOpacity
            onPress={() => router.push("/notifications")}
            event="user_open_notifications">
            <BellIcon size={28} color="white" fill={"white"} />
            {unreadCount > 0 && (
              <View
                style={[
                  styles.notificationBadgeBackground,
                  tw`absolute -top-2 -right-2 rounded-full text-center flex w-5 h-5 justify-center items-center`,
                ]}>
                <ThemedText style={[styles.notificationTextColor, tw`text-sm`]} semibold>
                  {unreadCount}
                </ThemedText>
              </View>
            )}
          </HapticTouchableOpacity>

          <HapticTouchableOpacity
            onPress={() => router.push("/search")}
            event="user_opened_search_screen_from_feed">
            <SearchIcon size={28} color="white" />
          </HapticTouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBadgeBackground: {
    backgroundColor: colors.light.destructive,
  },
  notificationTextColor: {
    color: colors.light.destructiveForeground,
  },
});

export default memo(FeedHeader);
