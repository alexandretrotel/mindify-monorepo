import type { Tables } from "@/types/supabase";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import MindTextOverlay from "@/components/features/feed/MindTextOverlay";
import TextOverlay from "@/components/features/feed/TextOverlay";
import { Asset } from "expo-asset";
import { useFocusEffect } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import tw from "@/lib/tailwind";
import { usePostHog } from "posthog-react-native";
import { useFeed } from "@/providers/FeedProvider";

const VideoItem = ({
  item,
  shouldPlay,
}: {
  item: Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
    videoAsset: Asset;
  };
  shouldPlay: boolean;
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const video = React.useRef<VideoView>(null);
  const isFocused = useIsFocused();
  const posthog = usePostHog();
  const { shouldPlaySound } = useFeed();

  const player = useVideoPlayer(item?.videoAsset, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    if (isFocused && !isPaused && shouldPlay && player) {
      try {
        player.play();
      } catch {
        return;
      }
    } else {
      try {
        player.pause();
      } catch {
        return;
      }
    }
  }, [isFocused, isPaused, player, shouldPlay]);

  useEffect(() => {
    if (shouldPlaySound) {
      try {
        player.muted = false;
      } catch {
        return;
      }
    } else {
      try {
        player.muted = true;
      } catch {
        return;
      }
    }
  }, [player, shouldPlaySound]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (player) {
          try {
            player.pause();
          } catch {
            return;
          }
        }
      };
    }, [player]),
  );

  const windowHeight = useMemo(() => Dimensions.get("window").height, []);
  const windowWidth = useMemo(() => Dimensions.get("window").width, []);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onLongPress={() => {
        if (posthog.optedOut === false) {
          posthog.capture("user_long_pressed_video_item", { mind_id: item?.id });
        }
      }}
      onPressIn={() => {
        setIsPaused(true);
      }}
      onPressOut={() => {
        setIsPaused(false);
      }}>
      <View
        style={[
          tw`flex-1`,
          {
            height: windowHeight,
            width: windowWidth,
          },
        ]}>
        <View
          style={tw`absolute z-50 h-full inset-0 p-4 gap-8 flex-col justify-center items-center w-full`}>
          <MindTextOverlay text={item?.text} isPaused={isPaused} shouldPlay={shouldPlay} />
        </View>

        <TextOverlay item={item} />

        <VideoView
          ref={video}
          style={tw`h-full w-full`}
          player={player}
          nativeControls={false}
          contentFit="cover"
        />
      </View>
    </TouchableOpacity>
  );
};

export default memo(VideoItem);
