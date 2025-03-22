import React from "react";
import { Platform, View } from "react-native";
import { BookmarkIcon, ShoppingCartIcon, ShareIcon, XIcon } from "lucide-react-native";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";
import useUserSummaryState from "@/hooks/global/summaries/useUserSummaryState";
import { useSession } from "@/providers/SessionProvider";

const SummaryHeader = ({
  handleSeeOriginal,
  handleShare,
  handleClose,
  summaryId,
  summaryTitle,
}: {
  handleSeeOriginal: () => void;
  handleShare: () => void;
  handleClose: () => void;
  summaryId: number;
  summaryTitle: string;
}) => {
  const { userId } = useSession();
  const { colors, colorStyles } = useTheme();
  const { toggleSave, isSaved } = useUserSummaryState(userId, summaryId);

  return (
    <View
      style={[
        { borderBottomColor: colors.border, backgroundColor: colors.card },
        tw`flex-row justify-between items-center w-full p-4 border-b`,
      ]}>
      <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
        Aperçu
      </ThemedText>
      <View style={tw`flex-row gap-6 items-center`}>
        <HapticTouchableOpacity
          onPress={() => toggleSave()}
          event={isSaved ? "user_unsaved_summary_from_preview" : "user_saved_summary_from_preview"}
          eventProps={{ summary_id: summaryId, summary_title: summaryTitle }}>
          <BookmarkIcon
            size={24}
            color={colors.foreground}
            fill={isSaved ? colors.foreground : colors.card}
          />
        </HapticTouchableOpacity>
        {Platform.OS !== "ios" && (
          <HapticTouchableOpacity
            onPress={handleSeeOriginal}
            event="user_viewed_original_summary_source"
            eventProps={{ summary_id: summaryId, summary_title: summaryTitle }}>
            <ShoppingCartIcon size={24} color={colors.foreground} />
          </HapticTouchableOpacity>
        )}
        <HapticTouchableOpacity
          onPress={handleShare}
          event="user_shared_summary"
          eventProps={{ summary_id: summaryId, summary_title: summaryTitle }}>
          <ShareIcon size={24} color={colors.foreground} />
        </HapticTouchableOpacity>
        <HapticTouchableOpacity
          onPress={handleClose}
          event="user_closed_summary_preview"
          eventProps={{ summary_id: summaryId, summary_title: summaryTitle }}>
          <XIcon size={24} color={colors.foreground} />
        </HapticTouchableOpacity>
      </View>
    </View>
  );
};

export default SummaryHeader;
