import { Card } from "@/components/global/card/Card";
import ThemedText from "@/components/typography/ThemedText";
import { View, StyleSheet } from "react-native";
import React from "react";
import AnimateNumber from "react-native-animate-number";
import Separator from "@/components/ui/Separator";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/constants/colors";
import tw from "@/lib/tailwind";

export default function Statistics({
  unknownCards,
  learningCards,
  knownCards,
}: Readonly<{
  unknownCards: number;
  learningCards: number;
  knownCards: number;
}>) {
  const { colorStyles } = useTheme();

  return (
    <Card>
      <View style={tw`flex-row justify-evenly gap-8`}>
        <View style={tw`flex flex-col w-full text-center items-center justify-center`}>
          <ThemedText semibold style={[tw`text-base`, colorStyles.textCardForeground]}>
            <AnimateNumber countBy={1} value={unknownCards} />
          </ThemedText>
          <ThemedText style={[styles.textDestructive, tw`text-xs`]}>
            nouvelle{unknownCards > 1 ? "s" : ""}
          </ThemedText>
        </View>

        <Separator direction="vertical" />

        <View style={tw`flex flex-col w-full text-center items-center justify-center`}>
          <ThemedText semibold style={[tw`text-base`, colorStyles.textCardForeground]}>
            <AnimateNumber countBy={1} value={learningCards} />
          </ThemedText>
          <ThemedText style={tw`text-blue-500 text-xs`}>en cours</ThemedText>
        </View>

        <Separator direction="vertical" />

        <View style={tw`flex flex-col w-full text-center items-center justify-center`}>
          <ThemedText semibold style={[tw`text-base`, colorStyles.textCardForeground]}>
            <AnimateNumber countBy={1} value={knownCards} />
          </ThemedText>
          <ThemedText style={[colorStyles.textPrimary, tw`text-xs`]}>
            maîtrisée{knownCards > 1 ? "s" : ""}
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  textDestructive: {
    color: colors.light.destructive,
  },
});
