import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import ChangePassword from "@/components/features/account/security/ChangePassword";
import DeleteAccount from "@/components/features/account/security/DeleteAccount";
import Separator from "@/components/ui/Separator";
import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";
import React from "react";
import { Platform, ScrollView, View } from "react-native";
import tw from "@/lib/tailwind";
import CollectDataOptOut from "@/components/features/account/security/CollectDataOptOut";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Security() {
  const { colorStyles } = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  const paddingBottom = Platform.OS === "ios" ? safeAreaInsets.bottom : safeAreaInsets.bottom + 16;

  return (
    <HeaderPageContainer>
      <StackScreen />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            {
              paddingBottom: paddingBottom,
            },
            tw`pt-8 flex-col gap-8`,
          ]}>
          <View style={tw`flex-col`}>
            <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
              Sécurité
            </ThemedText>
            <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
              Change ton mot de passe et configure les paramètres de sécurité de ton compte.
            </ThemedText>
          </View>

          <Separator style={tw`my-2`} />

          <View style={tw`flex-col gap-12`}>
            <ChangePassword />
            <CollectDataOptOut />
            <DeleteAccount />
          </View>
        </View>
      </ScrollView>
    </HeaderPageContainer>
  );
}

function StackScreen() {
  return (
    <Stack.Screen
      options={{
        title: "Sécurité",
        headerTitle: "Sécurité",
      }}
    />
  );
}
