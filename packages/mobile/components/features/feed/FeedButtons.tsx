import useUserMindState from "@/hooks/global/minds/useUserMindState";
import { useSession } from "@/providers/SessionProvider";
import { handleLikeMind, handleSaveMind } from "@/utils/minds";
import { BookmarkIcon, EllipsisIcon, HeartIcon } from "lucide-react-native";
import React from "react";
import ActionButton from "@/components/features/feed/ActionButton";
import { Alert, View } from "react-native";
import tw from "@/lib/tailwind";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useFeed } from "@/providers/FeedProvider";

export default function FeedButtons({
  mindId,
}: Readonly<{
  mindId: number;
}>) {
  const { userId } = useSession();
  const { showActionSheetWithOptions } = useActionSheet();
  const {
    likedMind,
    savedMind,
    likedMindCount,
    savedMindCount,
    setLikedMind,
    setLikedMindCount,
    setSavedMind,
    setSavedMindCount,
  } = useUserMindState(mindId, userId);
  const {
    shouldAnimateText,
    handleToggleShouldAnimateText,
    shouldPlaySound,
    handleToggleShouldPlaySound,
  } = useFeed();

  return (
    <View style={tw`flex-col gap-4`}>
      <ActionButton
        icon={HeartIcon}
        color={likedMind ? "red" : "white"}
        fillColor={likedMind ? "red" : "white"}
        count={likedMindCount}
        event={likedMind ? "user_unliked_mind_from_feed" : "user_liked_mind_from_feed"}
        eventProps={{ mind_id: mindId }}
        onPress={() => {
          if (!userId) {
            Alert.alert("Tu dois être connecté pour aimer un MIND");
            return;
          }
          handleLikeMind(userId, likedMind, mindId, setLikedMind, setLikedMindCount);
        }}
      />

      <ActionButton
        icon={BookmarkIcon}
        color={savedMind ? "yellow" : "white"}
        fillColor={savedMind ? "yellow" : "white"}
        count={savedMindCount}
        event={savedMind ? "user_unsaved_mind_from_feed" : "user_saved_mind_from_feed"}
        eventProps={{ mind_id: mindId }}
        onPress={() => {
          if (!userId) {
            Alert.alert("Tu dois être connecté pour sauvegarder un MIND");
            return;
          }
          handleSaveMind(userId, savedMind, mindId, setSavedMind, setSavedMindCount);
        }}
      />

      <ActionButton
        icon={EllipsisIcon}
        color={"white"}
        fillColor={"white"}
        event={"user_opened_mind_options_from_feed"}
        eventProps={{ mind_id: mindId }}
        onPress={() => {
          const animationText = shouldAnimateText
            ? "Désactiver les animations"
            : "Activer les animations";

          const soundText = shouldPlaySound ? "Désactiver le son" : "Activer le son";

          showActionSheetWithOptions(
            {
              options: [animationText, soundText, "Annuler"],
              cancelButtonIndex: 2,
            },
            (buttonIndex) => {
              if (buttonIndex === 0) {
                handleToggleShouldAnimateText();
              }

              if (buttonIndex === 1) {
                handleToggleShouldPlaySound();
              }
            },
          );
        }}
      />
    </View>
  );
}
