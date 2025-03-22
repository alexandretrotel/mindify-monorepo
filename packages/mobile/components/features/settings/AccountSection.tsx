import Separator from "@/components/ui/Separator";
import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import { ArrowRightIcon, LockIcon, PaintBucketIcon, UserIcon, ZapIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import tw from "@/lib/tailwind";

export default function AccountSection() {
  const router = useRouter();
  const { colors, colorStyles } = useTheme();

  return (
    <View style={tw`flex-col gap-8 w-full`}>
      <ThemedText semibold style={colorStyles.mutedForeground}>
        Mon compte
      </ThemedText>

      <View style={tw`flex-col gap-4 w-full`}>
        <HapticTouchableOpacity
          onPress={() => router.push("/my-account/profile")}
          event="user_opened_profile_settings">
          <View style={tw`w-full flex-row items-center justify-between gap-4`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <UserIcon size={20} color={colors.foreground} />
              <ThemedText>Profil</ThemedText>
            </View>

            <ArrowRightIcon size={20} color={colors.foreground} />
          </View>
        </HapticTouchableOpacity>

        <Separator />

        <HapticTouchableOpacity
          onPress={() => router.push("/my-account/security")}
          event="user_opened_security_settings">
          <View style={tw`w-full flex-row items-center justify-between gap-4`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <LockIcon size={20} color={colors.foreground} />
              <ThemedText>Sécurité</ThemedText>
            </View>

            <ArrowRightIcon size={20} color={colors.foreground} />
          </View>
        </HapticTouchableOpacity>

        <Separator />

        <HapticTouchableOpacity
          onPress={() => router.push("/my-account/appearance")}
          event="user_opened_appearance_settings">
          <View style={tw`w-full flex-row items-center justify-between gap-4`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <PaintBucketIcon size={20} color={colors.foreground} />
              <ThemedText>Apparence</ThemedText>
            </View>

            <ArrowRightIcon size={20} color={colors.foreground} />
          </View>
        </HapticTouchableOpacity>

        <Separator />

        <HapticTouchableOpacity
          onPress={() => router.push("/my-account/personalization")}
          event="user_opened_personalization_settings">
          <View style={tw`w-full flex-row items-center justify-between gap-4`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <ZapIcon size={20} color={colors.foreground} />
              <ThemedText>Personnalisation</ThemedText>
            </View>

            <ArrowRightIcon size={20} color={colors.foreground} />
          </View>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
