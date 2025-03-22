import { Card, CardBody, CardFooter, CardHeader } from "@/components/global/card/Card";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import type { Tables } from "@/types/supabase";
import { useRouter } from "expo-router";
import React from "react";
import { View, Image } from "react-native";
import tw from "@/lib/tailwind";

const SummaryCarouselItem = React.memo(
  ({
    summary,
    availableHeight,
  }: {
    summary: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
    availableHeight: number;
  }) => {
    const router = useRouter();
    const { colorStyles } = useTheme();

    return (
      <View style={[{ height: availableHeight }, tw`w-full px-4 pb-28`]}>
        <Card style={tw`h-full`}>
          <CardHeader>
            <ThemedText style={colorStyles.textPrimary}>{summary?.authors?.name}</ThemedText>
            <ThemedText semibold style={tw`text-2xl`}>
              {summary?.title}
            </ThemedText>
          </CardHeader>

          <CardBody>
            {summary?.image_url && (
              <View style={[colorStyles.bgMuted, tw`h-96 w-64 rounded-lg mx-auto overflow-hidden`]}>
                <Image
                  source={{
                    uri: summary?.image_url,
                  }}
                  style={tw`h-full w-full rounded-lg border`}
                />
              </View>
            )}
          </CardBody>

          <CardFooter>
            <GenericHapticButton
              variant="default"
              textVariant="textDefault"
              event="user_tapped_summary"
              onPress={() => {
                router.push({
                  pathname: "/summary/preview/[summaryId]",
                  params: { summaryId: summary?.id },
                });
              }}>
              Approfondir cette idée
            </GenericHapticButton>
          </CardFooter>
        </Card>
      </View>
    );
  },
);
SummaryCarouselItem.displayName = "SummaryCarouselItem";

export default SummaryCarouselItem;
