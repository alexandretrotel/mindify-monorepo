import ProgressBar from "@/components/features/learning/ProgressBar";
import ThemedText from "@/components/typography/ThemedText";
import useUserLevel from "@/hooks/global/user/useUserLevel";
import tw from "@/lib/tailwind";
import { useSession } from "@/providers/SessionProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Animated, FlatList, Platform, ScrollView, View } from "react-native";
import React, { useEffect, useRef } from "react";
import AnimateNumber from "react-native-animate-number";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/global/card/Card";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import ReadingStreakCard from "@/components/features/profile/cards/ReadingStreakCard";
import useSummariesByTopicId from "@/hooks/global/summaries/useSummariesByTopicId";
import SummaryCoverCard from "@/components/global/summaries/SummaryCoverCard";
import { router, useGlobalSearchParams } from "expo-router";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";

export default function SummaryEnd() {
  const { topicId } = useGlobalSearchParams<{
    topicId: string;
  }>();
  const parsedTopic = parseInt(topicId, 10);

  const { colorStyles } = useTheme();
  const { userId } = useSession();
  const { xp, xpForNextLevel } = useUserLevel(userId);
  const { summaries } = useSummariesByTopicId(parsedTopic);
  const safeAreaInsets = useSafeAreaInsets();

  const paddingBottom = Platform.OS === "ios" ? safeAreaInsets.bottom : safeAreaInsets.bottom + 16;

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim1, fadeAnim2, fadeAnim3]);

  return (
    <HeaderPageContainer noPadding>
      <ScrollView
        contentContainerStyle={[
          tw`flex-col gap-8 h-full justify-start items-center py-4`,
          {
            paddingBottom,
          },
        ]}>
        <View style={[tw`w-full flex-col gap-8`]}>
          <Animated.View style={[tw`w-full flex-col gap-4 px-4`, { opacity: fadeAnim1 }]}>
            <ThemedText semibold style={[tw`text-xl`, colorStyles.textForeground]}>
              On est fiers de toi !
            </ThemedText>

            <Card style={tw`w-full`}>
              <CardHeader>
                <View style={tw`flex-row items-center justify-between`}>
                  <ThemedText semibold style={[tw`text-base`, colorStyles.textForeground]}>
                    Progression
                  </ThemedText>

                  <ThemedText style={[tw`text-sm`, colorStyles.textForeground]}>
                    <AnimateNumber value={xp} countBy={50} />/{xpForNextLevel} XP
                  </ThemedText>
                </View>
              </CardHeader>

              <CardBody>
                <ProgressBar current={xp} total={xpForNextLevel} />
              </CardBody>

              <CardFooter>
                <View style={tw`flex-row justify-between items-center`}>
                  <ThemedText style={[tw`text-sm`, colorStyles.textMutedForeground]}>
                    Accumule encore <AnimateNumber value={xpForNextLevel - xp} countBy={1} /> XP
                    pour passer au niveau suivant.
                  </ThemedText>
                </View>
              </CardFooter>
            </Card>

            <ReadingStreakCard userId={userId} />
          </Animated.View>

          <Animated.View style={[tw`w-full flex-col gap-4`, { opacity: fadeAnim2 }]}>
            <ThemedText semibold style={[tw`text-xl mx-4`, colorStyles.textForeground]}>
              Suggestions
            </ThemedText>

            <FlatList
              data={summaries?.slice(0, 3)}
              renderItem={({ item }) => (
                <View style={tw`w-64 h-72`}>
                  <SummaryCoverCard summary={item} horizontal />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`flex-row items-center gap-4 px-4`}
            />
          </Animated.View>
        </View>

        <Animated.View style={[tw`w-full px-4`, { opacity: fadeAnim3 }]}>
          <GenericHapticButton
            variant="default"
            textVariant="textDefault"
            event="user_pressed_continue_after_reading"
            onPress={() => router.replace("/feed")}>
            Continuer
          </GenericHapticButton>
        </Animated.View>
      </ScrollView>
    </HeaderPageContainer>
  );
}
