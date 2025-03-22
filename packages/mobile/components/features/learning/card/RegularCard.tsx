import React from "react";
import { View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import LearnCardHeader from "@/components/features/learning/card/LearningCardHeader";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import { CardHeader, CardBody, CardFooter } from "@/components/global/card/Card";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function RegularCard({
  handlePress,
  authorName,
  summaryTitle,
  question,
}: Readonly<{
  handlePress: () => void;
  authorName: string;
  summaryTitle: string;
  question: string | null;
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
        <LearnCardHeader authorName={authorName} summaryTitle={summaryTitle} />
      </CardHeader>

      <CardBody>
        <ThemedText style={[colorStyles.textForeground, tw`text-base`]} semibold>
          {question ?? "Aucune question"}
        </ThemedText>
      </CardBody>

      <CardFooter>
        <GenericHapticButton
          variant="black"
          textVariant="textBlack"
          event="user_checked_flashcard_answer"
          eventProps={{ question: question }}
          onPress={() => handlePress()}>
          Voir la réponse
        </GenericHapticButton>
      </CardFooter>
    </View>
  );
}
