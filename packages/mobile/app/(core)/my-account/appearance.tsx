import React from "react";
import { View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import AppearanceButton from "@/components/features/settings/appearance/AppearanceButton";
import { Stack } from "expo-router";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";

export default function Appearance() {
  const { colorStyles } = useTheme();

  return (
    <HeaderPageContainer>
      <StackScreen />
      <View style={tw`flex-col pt-8 gap-4`}>
        <ThemedText style={[tw`text-lg`, colorStyles.textForeground]} semibold>
          Apparence
        </ThemedText>

        <View style={tw`flex-col gap-4`}>
          <AppearanceButton theme="light">Clair</AppearanceButton>
          <AppearanceButton theme="dark">Sombre</AppearanceButton>
          <AppearanceButton theme="system">Système</AppearanceButton>
        </View>
      </View>
    </HeaderPageContainer>
  );
}

function StackScreen() {
  return (
    <Stack.Screen
      options={{
        title: "Apparence",
        headerTitle: "Apparence",
      }}
    />
  );
}
