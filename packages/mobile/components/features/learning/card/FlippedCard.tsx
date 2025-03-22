import { View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import React from "react";
import LearningCardHeader from "@/components/features/learning/card/LearningCardHeader";
import { CardBody, CardFooter, CardHeader } from "@/components/global/card/Card";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function FlippedCard({
  handlePress,
  authorName,
  summaryTitle,
  answer,
}: Readonly<{
  handlePress: () => void;
  authorName: string;
  summaryTitle: string;
  answer: string;
}>) {
  const { colorStyles } = useTheme();

  return (
    <View
      style={[
        colorStyles.bgCard,
        colorStyles.border,
        tw`w-full h-full flex justify-between items-start rounded-xl p-4 border`,
      ]}>
      <CardHeader>
        <LearningCardHeader authorName={authorName} summaryTitle={summaryTitle} />
      </CardHeader>

      <CardBody>
        <ThemedText style={[colorStyles.textForeground, tw`text-base`]} semibold>
          {answer}
        </ThemedText>
      </CardBody>

      <CardFooter>
        <GenericHapticButton onPress={() => handlePress()} variant="black" textVariant="textBlack">
          Revenir à la question
        </GenericHapticButton>
      </CardFooter>
    </View>
  );
}
