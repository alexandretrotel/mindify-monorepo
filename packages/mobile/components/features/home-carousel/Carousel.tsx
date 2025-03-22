import type { Tables } from "@/types/supabase";
import { FlatList, View } from "react-native";
import SummaryCarouselItem from "@/components/features/home-carousel/CarouselSummaryItem";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import tw from "@/lib/tailwind";

export default function CarouselSection({
  loading,
  filteredSummaries,
  availableHeight,
}: {
  loading: boolean;
  filteredSummaries: (Tables<"summaries"> & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
  })[];
  availableHeight: number;
}) {
  if (loading) {
    return (
      <View style={tw`flex justify-center items-center h-full`}>
        <ThemedActivityIndicator />
      </View>
    );
  }

  return (
    <View style={tw`w-full`}>
      <FlatList
        data={filteredSummaries}
        renderItem={({ item: summary }) => (
          <SummaryCarouselItem summary={summary} availableHeight={availableHeight} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        bounces
      />
    </View>
  );
}
