import { Card, CardBody, CardFooter, CardHeader } from "@/components/global/card/Card";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function DeckCard({
  dueCards,
  handleLearning,
}: Readonly<{
  dueCards: number;
  handleLearning: (unknownCards: number) => void;
}>) {
  const { colorStyles } = useTheme();

  return (
    <Card padding="medium">
      <CardHeader>
        <ThemedText style={[colorStyles.textPrimary, tw`text-xs`]}>
          {dueCards} carte{dueCards > 1 ? "s" : ""} à réviser
        </ThemedText>
        <ThemedText semibold style={[tw`text-xl`, colorStyles.textCardForeground]}>
          Enregistrés
        </ThemedText>
      </CardHeader>

      <CardBody>
        <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
          Ce sont tous les minds que tu as enregistrés.
        </ThemedText>
      </CardBody>

      <CardFooter>
        <GenericHapticButton
          event="user_started_learning_deck"
          onPress={() => handleLearning(dueCards)}
          disabled={!dueCards}
          variant="default"
          textVariant="textDefault">
          Réviser le deck
        </GenericHapticButton>
      </CardFooter>
    </Card>
  );
}
