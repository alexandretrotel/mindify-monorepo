import { useSession } from "@/providers/SessionProvider";
import { type Grade } from "ts-fsrs";
import { View } from "react-native";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import tw from "@/lib/tailwind";

export default function ReviewButton({
  grade,
  text,
  handleUpdateCard,
}: Readonly<{
  grade: Grade;
  text: string;
  handleUpdateCard: (userId: string, grade: Grade) => void;
}>) {
  const { userId } = useSession();

  return (
    <View style={tw`w-1/2`}>
      <GenericHapticButton
        onPress={() => {
          if (!userId) {
            return;
          }

          handleUpdateCard(userId, grade);
        }}
        variant="black"
        textVariant="textBlack">
        {text}
      </GenericHapticButton>
    </View>
  );
}
