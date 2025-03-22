import { Redirect, Stack, useGlobalSearchParams } from "expo-router";
import React, { useState } from "react";
import ChaptersList from "@/components/features/summary/ChaptersList";
import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import ThemedText from "@/components/typography/ThemedText";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import useSummary from "@/hooks/global/summaries/useSummary";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";

export default function SummaryScreen() {
  const { summaryId } = useGlobalSearchParams<{
    summaryId: string;
  }>();

  const [scrollProgress, setScrollProgress] = useState(0);

  const { summary, loading } = useSummary(summaryId);
  const { colors } = useTheme();

  const summaryTitle = summary?.title ?? "Résumé";

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;

    const progress = (scrollOffset / (contentHeight - scrollViewHeight)) * 100;
    setScrollProgress(progress);
  };

  const clampedScrollProgress = Math.min(100, Math.max(0, scrollProgress));

  if (!summary && !loading) {
    Redirect({
      href: "/",
    });
  }

  if (loading) {
    return (
      <CenteredContainer>
        <StackScreen summaryTitle={summaryTitle} />
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  if (!summary) {
    return (
      <CenteredContainer>
        <StackScreen summaryTitle={summaryTitle} />
        <ThemedText>Impossible de charger le résumé</ThemedText>
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer noPadding>
      <View
        style={[
          tw`absolute top-0 inset-x-0 h-1`,
          {
            backgroundColor: clampedScrollProgress === 0 ? "transparent" : colors.primary,
            width: `${clampedScrollProgress}%`,
          },
        ]}
      />

      <StackScreen summaryTitle={summaryTitle} />
      <ChaptersList summary={summary} handleScroll={handleScroll} />
    </HeaderPageContainer>
  );
}

function StackScreen({ summaryTitle }: Readonly<{ summaryTitle: string }>) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title: summaryTitle,
        headerTitle: summaryTitle,
      }}
    />
  );
}
