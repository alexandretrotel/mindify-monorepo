import { FlatList, View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";
import TabButton from "@/components/ui/tabs/TabButton";
import useMindsBySummaryId from "@/hooks/global/minds/useMindsBySummaryId";
import MindItem from "@/components/global/minds/MindItem";

export default function SummaryData({
  authorDescription,
  summaryId: summaryId,
}: Readonly<{
  authorDescription?: string | null;
  summaryId: number;
}>) {
  const [activeTab, setActiveTab] = useState<"author" | "minds" | "mindify-ai">("author");

  const { colorStyles } = useTheme();
  const { minds } = useMindsBySummaryId(summaryId);

  return (
    <View style={tw`flex-col gap-8 px-4 w-full`}>
      <View style={[tw`flex-row gap-8 border-b w-full`, colorStyles.border]}>
        <TabButton activeTab={activeTab === "author"} onClick={() => setActiveTab("author")}>
          <ThemedText semibold style={[tw`text-base`, colorStyles.textForeground]}>
            Auteur
          </ThemedText>
        </TabButton>
        <TabButton activeTab={activeTab === "minds"} onClick={() => setActiveTab("minds")}>
          <ThemedText semibold style={[tw`text-base`, colorStyles.textForeground]}>
            Minds
          </ThemedText>
        </TabButton>
      </View>

      {activeTab === "author" && (
        <View style={tw`w-full`}>
          <ThemedText style={[tw`text-base`, colorStyles.textForeground]}>
            {authorDescription}
          </ThemedText>
        </View>
      )}

      {activeTab === "minds" && (
        <View>
          <FlatList
            data={minds}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MindItem mind={item} />}
            ItemSeparatorComponent={() => <View style={tw`my-2`} />}
            scrollEnabled={false}
            contentContainerStyle={tw`w-full`}
          />
        </View>
      )}
    </View>
  );
}
