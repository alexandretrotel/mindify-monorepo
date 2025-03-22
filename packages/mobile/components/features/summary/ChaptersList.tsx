import React from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import ChapterItem from "@/components/features/summary/ChapterItem";
import tw from "@/lib/tailwind";
import { getSummary } from "@/actions/summaries.action";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Summary = Awaited<ReturnType<typeof getSummary>>;

export default function ChaptersList({
  summary,
  handleScroll,
}: Readonly<{
  summary: Summary;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}>) {
  const safeAreaInsets = useSafeAreaInsets();

  const chapters = summary?.chapters ?? { titles: [], texts: [] };

  return (
    <View style={tw`relative h-full`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: safeAreaInsets.bottom + 32,
          paddingTop: 32,
          paddingHorizontal: 16,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <View style={tw`flex-col gap-12`}>
          {chapters.titles.map((_, index) => (
            <ChapterItem
              key={index}
              index={index}
              title={chapters.titles[index]}
              text={chapters.texts[index]}
              totalLength={chapters.titles.length}
              summaryId={summary?.id}
              topicId={summary?.topic_id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
