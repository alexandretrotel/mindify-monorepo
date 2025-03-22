import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import UpdateAvatar from "@/components/features/account/profile/UpdateAvatar";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import Input from "@/components/ui/Input";
import Separator from "@/components/ui/Separator";
import ThemedText from "@/components/typography/ThemedText";
import useUpdateProfile from "@/hooks/features/account/profile/useUpdateProfile";
import { useTheme } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "@/lib/tailwind";

export default function Profile() {
  const { colorStyles } = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const {
    initialUsername,
    username,
    initialBiography,
    biography,
    email,
    handleChangeUsername,
    handleChangeBiography,
    canUpdate,
    updating,
    handleUpdateProfile,
  } = useUpdateProfile();

  const paddingBottom = Platform.OS === "ios" ? safeAreaInsets.bottom : safeAreaInsets.bottom + 16;

  return (
    <HeaderPageContainer keyboard>
      <StackScreen />
      <View
        style={[{ paddingBottom: paddingBottom }, tw`pt-8 flex-col gap-8 h-full justify-between`]}>
        <View style={tw`flex-col gap-8`}>
          <View style={tw`flex-col`}>
            <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
              Modifier mon profil
            </ThemedText>
            <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
              Renseigne les informations que les autres utilisateurs verront sur ton profil.
            </ThemedText>
          </View>

          <Separator />

          <View style={tw`flex-col gap-12`}>
            <UpdateAvatar />

            <View style={tw`flex-col gap-2`}>
              <ThemedText semibold>Nom d'affichage</ThemedText>
              <Input
                placeholder={initialUsername}
                value={username}
                inputMode="text"
                onChangeText={(text) => handleChangeUsername(text)}
              />
            </View>

            <View style={tw`flex-col gap-2`}>
              <ThemedText semibold>Biographie</ThemedText>
              <Input
                placeholder={initialBiography ?? "Aucune biographie"}
                inputMode="text"
                value={biography}
                onChangeText={(text) => handleChangeBiography(text)}
              />
            </View>

            <View style={tw`flex-col gap-2`}>
              <ThemedText semibold>Email</ThemedText>
              <Input
                inputMode="email"
                placeholder={email}
                value={email}
                onChangeText={() => {}}
                disabled={true}
              />
            </View>
          </View>
        </View>

        <GenericHapticButton
          event="user_updated_profile"
          onPress={handleUpdateProfile}
          variant="default"
          textVariant="textDefault"
          disabled={!canUpdate}
          loading={updating}>
          Enregistrer les modifications
        </GenericHapticButton>
      </View>
    </HeaderPageContainer>
  );
}

function StackScreen() {
  return (
    <Stack.Screen
      options={{
        title: "Profil",
        headerTitle: "Profil",
      }}
    />
  );
}
