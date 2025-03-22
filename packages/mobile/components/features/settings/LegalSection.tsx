import ThemedText from "@/components/typography/ThemedText";
import { ArrowUpRightIcon, CookieIcon, GlobeLockIcon, SignatureIcon } from "lucide-react-native";
import { Alert, View } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import Separator from "@/components/ui/Separator";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";
import { cookiesURL, privacyURL, termsURL } from "@/constants/url";

export default function LegalSection() {
  const { colors } = useTheme();

  const handleOpenURL = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible d'ouvrir la page");
    }
  };

  return (
    <View style={tw`flex-col gap-8 w-full`}>
      <ThemedText semibold>Légal</ThemedText>

      <View style={tw`flex-col gap-4 w-full`}>
        <HapticTouchableOpacity
          onPress={() => handleOpenURL(privacyURL)}
          event="user_opened_privacy_policy">
          <View style={tw`w-full flex-row items-center justify-between gap-4`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <GlobeLockIcon size={20} color={colors.foreground} />
              <ThemedText>Politique de confidentialité</ThemedText>
            </View>

            <ArrowUpRightIcon size={20} color={colors.foreground} />
          </View>
        </HapticTouchableOpacity>

        <Separator />

        <HapticTouchableOpacity
          onPress={() => handleOpenURL(cookiesURL)}
          event="user_opened_cookies_policy">
          <View style={tw`w-full flex-row items-center justify-between gap-4`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <CookieIcon size={20} color={colors.foreground} />
              <ThemedText>Politique de cookies</ThemedText>
            </View>

            <ArrowUpRightIcon size={20} color={colors.foreground} />
          </View>
        </HapticTouchableOpacity>

        <Separator />

        <HapticTouchableOpacity
          onPress={() => handleOpenURL(termsURL)}
          event="user_opened_terms_of_service">
          <View style={tw`w-full flex-row items-center justify-between gap-4`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <SignatureIcon size={20} color={colors.foreground} />
              <ThemedText>Conditions d'utilisation</ThemedText>
            </View>

            <ArrowUpRightIcon size={20} color={colors.foreground} />
          </View>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
