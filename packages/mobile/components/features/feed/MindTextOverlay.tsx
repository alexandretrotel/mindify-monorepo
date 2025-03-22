import { View } from "react-native";
import React, { memo } from "react";
import useAnimatedText from "@/hooks/features/feed/useAnimatedText";
import { useFeed } from "@/providers/FeedProvider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const MindTextOverlay = ({
  text,
  isPaused,
  shouldPlay,
}: {
  text: string;
  isPaused: boolean;
  shouldPlay: boolean;
}) => {
  const { shouldAnimateText } = useFeed();
  const tabBarHeight = useBottomTabBarHeight();
  const { getStyledText } = useAnimatedText(text, isPaused, shouldPlay, shouldAnimateText);

  return <View style={{ marginBottom: tabBarHeight }}>{getStyledText()}</View>;
};

export default memo(MindTextOverlay);
