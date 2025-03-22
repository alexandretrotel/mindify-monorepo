import type { Tables } from "@/types/supabase";
import { useRouter } from "expo-router";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import ThemedText from "@/components/typography/ThemedText";
import { Card, CardHeader } from "@/components/global/card/Card";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function SummaryItem({
  summary,
  from_screen,
}: Readonly<{
  summary: Tables<"summaries"> & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
  };
  from_screen: string;
}>) {
  const { colorStyles } = useTheme();
  const router = useRouter();

  return (
    <HapticTouchableOpacity
      onPress={() => router.push(`/summary/preview/${summary.id}`)}
      event="user_opened_summary_preview"
      eventProps={{
        summary_id: summary.id,
        summary_title: summary.title,
        from: "summary_item",
        from_screen,
      }}>
      <Card>
        <CardHeader>
          <ThemedText style={[colorStyles.textPrimary, tw`text-sm`]}>
            {summary.authors.name}
          </ThemedText>
          <ThemedText semibold style={[colorStyles.textForeground, tw`text-base`]}>
            {summary.title}
          </ThemedText>

          <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
            {summary.topics.name}
          </ThemedText>
        </CardHeader>
      </Card>
    </HapticTouchableOpacity>
  );
}
