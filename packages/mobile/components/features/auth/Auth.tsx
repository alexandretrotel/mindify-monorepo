import React, { lazy, useRef } from "react";
import { Dimensions, Platform, View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import Apple from "@/components/features/auth/Apple";
import Constants from "expo-constants";
import { useTheme } from "@/providers/ThemeProvider";
import NoHeaderPageContainer from "@/components/containers/NoHeaderPageContainer";
import tw from "@/lib/tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { useVideoPlayer, VideoView } from "expo-video";
import { assets } from "@/constants/assets";

export default function Auth() {
  const { colors } = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const router = useRouter();

  const videoAsset = assets?.videos[6];

  const videoRef = useRef<VideoView>(null);
  const player = useVideoPlayer(videoAsset, (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  const isExpoGo = Constants.appOwnership === "expo";

  const Google = !isExpoGo ? lazy(() => import("@/components/features/auth/Google")) : null;

  const totalWidth = Dimensions.get("window").width;
  const containerWidth = totalWidth - 32;
  const containerWidthWithoutGap = containerWidth - 8;
  const buttonWidth = containerWidthWithoutGap / 2;

  const paddingBottom =
    Platform.OS === "android" ? safeAreaInsets.bottom + 32 : safeAreaInsets.bottom + 16;

  return (
    <NoHeaderPageContainer noSafeArea noPadding>
      <VideoView
        ref={videoRef}
        contentFit="cover"
        player={player}
        style={tw`absolute inset-0 w-full h-full`}
        nativeControls={false}
      />

      <View
        style={[
          tw`flex items-center justify-between h-full gap-8 px-4`,
          { paddingTop: safeAreaInsets.top + 32, paddingBottom: paddingBottom },
        ]}>
        <View style={tw`flex items-center justify-center`}>
          <ThemedText style={[tw`text-2xl text-white`]} semibold>
            Bienvenue sur Mindify !
          </ThemedText>
          <ThemedText style={[tw`text-base text-gray-100`]} semibold>
            Commence à apprendre dès maintenant.
          </ThemedText>
        </View>

        <View style={tw`flex flex-col gap-8 w-full mx-auto justify-center items-center`}>
          <View style={tw`flex flex-col gap-4 w-full mx-auto justify-center items-center`}>
            <View style={tw`w-full flex-row gap-2`}>
              {!isExpoGo && <Google buttonWidth={buttonWidth} />}
              <Apple buttonWidth={buttonWidth} />
            </View>

            <GenericHapticButton
              event="user_logged_in"
              onPress={() => router.push("/register")}
              variant="default"
              textVariant="textDefault"
              icon={<Ionicons name="mail" size={20} color={colors.background} />}>
              S'inscrire avec un e-mail
            </GenericHapticButton>
          </View>

          <View style={tw`flex-row gap-1`}>
            <ThemedText style={[tw`text-base text-white`]}>Déjà inscrit ? </ThemedText>
            <HapticTouchableOpacity
              onPress={() => router.push("/login")}
              event="user_clicked_on_login_button">
              <ThemedText semibold style={[tw`text-base text-white`]}>
                Se connecter
              </ThemedText>
            </HapticTouchableOpacity>
          </View>
        </View>
      </View>
    </NoHeaderPageContainer>
  );
}
