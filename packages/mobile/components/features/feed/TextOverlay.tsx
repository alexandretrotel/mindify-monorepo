import ThemedText from "@/components/typography/ThemedText";
import { View, StyleSheet } from "react-native";
import FeedButtons from "@/components/features/feed/FeedButtons";
import type { Tables } from "@/types/supabase";
import { memo } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/constants/colors";
import tw from "@/lib/tailwind";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import { useRouter } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const TextOverlay = ({
  item,
}: Readonly<{
  item: Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  };
}>) => {
  const { colorStyles } = useTheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View
      style={[
        tw`absolute z-50 bottom-0 inset-x-0 p-4 gap-8 flex-col w-full`,
        { marginBottom: tabBarHeight },
      ]}>
      <View style={tw`gap-8 flex-col`}>
        <View style={tw`flex flex-row items-end justify-between w-full`}>
          <View style={tw`flex flex-col w-3/4`}>
            <ThemedText style={[styles.text, tw`text-sm`]}>
              {item?.summaries?.topics?.name}
            </ThemedText>
            <ThemedText semibold style={[colorStyles.textWhite, tw`text-base`]}>
              {item?.summaries?.title}
            </ThemedText>
            <ThemedText style={[styles.text, tw`text-sm`]}>
              {item?.summaries?.authors?.name}
            </ThemedText>
          </View>

          <FeedButtons mindId={item?.id} />
        </View>

        <GenericHapticButton
          variant="black"
          textVariant="textBlack"
          event="video_item_clicked_summary_button"
          eventProps={{
            mind_id: item?.id,
            summary_id: item?.summary_id,
            summary_title: item?.summaries?.title,
          }}
          onPress={() => {
            if (!item?.summary_id) {
              return;
            }

            router.push(`/summary/preview/${item?.summary_id}`);
          }}>
          Approfondir cette idée
        </GenericHapticButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.light.muted,
  },
});

export default memo(TextOverlay);
