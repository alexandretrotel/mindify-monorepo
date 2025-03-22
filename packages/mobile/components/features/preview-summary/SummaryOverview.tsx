import { View, Image } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import ThemedText from "@/components/typography/ThemedText";
import tw from "@/lib/tailwind";
import useSummary from "@/hooks/global/summaries/useSummary";

type Summary = Awaited<ReturnType<typeof useSummary>>["summary"];

export default function SummaryOverview({
  summary,
}: Readonly<{
  summary: Summary;
}>) {
  const { colorStyles } = useTheme();

  const image = summary?.image_url;

  return (
    <View style={tw`flex-col w-full gap-4 items-center px-4`}>
      {image && (
        <View style={tw`flex-row items-center gap-4 h-48`}>
          <View
            style={[
              colorStyles.bgMuted,
              tw`flex flex-row justify-center items-center w-32 h-full rounded-md overflow-hidden`,
            ]}>
            <Image source={{ uri: image }} style={tw`h-full w-full border rounded-lg`} />
          </View>
        </View>
      )}

      <View style={tw`flex flex-col gap-2`}>
        <View style={tw`flex flex-col w-2/3`}>
          <View style={tw`items-center justify-center flex-row`}>
            <ThemedText
              style={[colorStyles.textPrimary, tw`text-center flex-row items-center text-base`]}>
              {summary?.topics?.name}
            </ThemedText>
          </View>
          <ThemedText semibold style={[tw`text-2xl text-center`, colorStyles.textForeground]}>
            {summary?.title}
          </ThemedText>
          <ThemedText style={[colorStyles.textMutedForeground, tw`text-center text-base`]} semibold>
            de {summary?.authors?.name}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
