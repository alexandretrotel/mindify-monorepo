import SummaryCoverItem from "@/components/global/summaries/SummaryCoverItem";
import ThemedText from "@/components/typography/ThemedText";
import React from "react";
import { SectionList, View } from "react-native";
import UserItem from "@/components/features/search/UserItem";
import Separator from "@/components/ui/Separator";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import useSearch from "@/hooks/features/search/useSearch";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import CenteredContainer from "@/components/containers/CenteredContainer";

type Summary = Awaited<ReturnType<typeof useSearch>>["searchResults"]["summaries"][number];
type User = Awaited<ReturnType<typeof useSearch>>["searchResults"]["users"][number];
type SectionItem = User | Summary;

function isUser(item: User | Summary): item is User {
  return (item as User).avatar !== undefined;
}

export default function SearchSection({
  searchQuery,
}: Readonly<{
  searchQuery: string;
}>) {
  const { searchResults, isSearching } = useSearch(searchQuery);
  const { colorStyles } = useTheme();

  if (isSearching) {
    return (
      <CenteredContainer>
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  const isEmpty = searchResults.users.length === 0 && searchResults.summaries.length === 0;

  if (isEmpty) {
    return (
      <CenteredContainer>
        <ThemedText style={[colorStyles.textForeground]}>Aucun résultat</ThemedText>
      </CenteredContainer>
    );
  }

  const sections = [
    {
      title: "Utilisateurs",
      data: [...searchResults.users].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10),
      renderItem: ({ item }: { item: SectionItem }) =>
        isUser(item) ? <UserItem user={item} /> : null,
    },
    {
      title: "Résumés",
      data: [...searchResults.summaries]
        .sort((a, b) => a.title.localeCompare(b.title))
        .slice(0, 10),
      renderItem: ({ item }: { item: SectionItem }) =>
        !isUser(item) ? <SummaryCoverItem summary={item} /> : null,
    },
  ].filter((section) => section.data.length > 0);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderSectionHeader={({ section: { title } }) => (
        <View style={tw`w-full flex gap-2`}>
          <ThemedText semibold style={[colorStyles.textForeground, tw`text-lg pt-4`]}>
            {title}
          </ThemedText>
        </View>
      )}
      renderItem={({ section, item }) => section.renderItem({ item })}
      ItemSeparatorComponent={() => <Separator style={tw`my-2`} />}
      SectionSeparatorComponent={() => <View style={tw`my-2`} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={tw`py-8 w-full items-start`}
      stickySectionHeadersEnabled={false}
    />
  );
}
