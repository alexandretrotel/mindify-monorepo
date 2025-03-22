import React from "react";
import { View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { BookmarkIcon, ShareIcon } from "lucide-react-native";
import { useSession } from "@/providers/SessionProvider";
import { handleSaveMind, onShare } from "@/utils/minds";
import type { Tables } from "@/types/supabase";
import { Card, CardBody, CardHeader } from "@/components/global/card/Card";
import useUserMindState from "@/hooks/global/minds/useUserMindState";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function MindItem({
  mind,
}: Readonly<{
  mind: Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  };
}>) {
  const { userId, userMetadata } = useSession();
  const { savedMind, setSavedMind } = useUserMindState(mind?.id, userId);

  const { colorStyles, colors } = useTheme();

  const userName = userMetadata?.name ?? "Inconnu";

  return (
    <Card>
      <CardHeader>
        <View style={tw`flex-row items-start justify-between gap-4`}>
          <View style={tw`flex-shrink`}>
            <ThemedText style={[colorStyles.textPrimary, tw`text-sm`]}>
              {mind.summaries.authors.name}
            </ThemedText>
            <ThemedText style={[colorStyles.textForeground, tw`text-lg`]} semibold>
              {mind.summaries.title}
            </ThemedText>
          </View>

          <View style={tw`flex-row items-center gap-2`}>
            <HapticTouchableOpacity
              onPress={() => handleSaveMind(userId, savedMind, mind?.id, setSavedMind)}
              event="user_saved_mind"
              eventProps={{ mind_id: mind?.id }}>
              <BookmarkIcon
                size={20}
                color={colors.foreground}
                fill={savedMind ? colors.foreground : colors.background}
              />
            </HapticTouchableOpacity>
            <HapticTouchableOpacity
              onPress={() => onShare(userName, mind)}
              event="user_shared_mind"
              eventProps={{ mind_id: mind?.id }}>
              <ShareIcon size={20} color={colors.foreground} />
            </HapticTouchableOpacity>
          </View>
        </View>
      </CardHeader>

      <CardBody>
        <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>{mind.text}</ThemedText>
      </CardBody>
    </Card>
  );
}
