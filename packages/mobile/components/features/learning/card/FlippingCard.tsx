import type { Tables } from "@/types/supabase";
import React from "react";
import { View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, withTiming } from "react-native-reanimated";
import RegularCard from "@/components/features/learning/card/RegularCard";
import { flipCardStyles } from "@/stylesheets/card";
import FlippedCard from "@/components/features/learning/card/FlippedCard";
import tw from "@/lib/tailwind";

export default function FlipCard({
  card,
  isFlipped,
}: Readonly<{
  card: Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  };
  isFlipped: { value: boolean };
}>) {
  const summaryTitle = card?.summaries?.title;
  const authorName = card?.summaries?.authors?.name;
  const question = card?.question;
  const answer = card?.text;

  const direction: string = "y";

  const isDirectionX = direction === "x";

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration: 500 });

    return {
      transform: [isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue }],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration: 500 });

    return {
      transform: [isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue }],
    };
  });

  const handlePress = () => {
    isFlipped.value = !isFlipped.value;
  };

  return (
    <View style={tw`w-full h-full`}>
      <Animated.View style={[flipCardStyles.regularCard, regularCardAnimatedStyle]}>
        <RegularCard
          handlePress={handlePress}
          authorName={authorName}
          summaryTitle={summaryTitle}
          question={question}
        />
      </Animated.View>
      <Animated.View style={[flipCardStyles.flippedCard, flippedCardAnimatedStyle]}>
        <FlippedCard
          handlePress={handlePress}
          authorName={authorName}
          summaryTitle={summaryTitle}
          answer={answer}
        />
      </Animated.View>
    </View>
  );
}
