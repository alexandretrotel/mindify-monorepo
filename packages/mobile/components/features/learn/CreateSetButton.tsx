import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { PlusIcon } from "lucide-react-native";
import { Alert, View } from "react-native";
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function CreateSetButton() {
  const { colorStyles, colors } = useTheme();

  return (
    <HapticTouchableOpacity
      onPress={() => {
        Alert.alert("Créer un set", "Cette fonctionnalité n'est pas encore disponible.");
      }}
      event="user_created_set">
      <View
        style={[
          tw`flex h-48 items-center justify-center rounded-lg border border-dashed`,
          colorStyles.bgMuted,
        ]}>
        <View style={tw`flex-row items-center justify-center gap-2 text-center`}>
          <PlusIcon size={24} color={colors.mutedForeground} />
          <ThemedText style={colorStyles.textMutedForeground} semibold>
            Créer un set
          </ThemedText>
        </View>
      </View>
    </HapticTouchableOpacity>
  );
}
