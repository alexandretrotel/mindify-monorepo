import React from "react";
import { useSearch } from "@/providers/SearchProvider";
import TopicsSection from "@/components/features/search/TopicsSection";
import SearchSection from "@/components/features/search/SearchSection";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import { View } from "react-native";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import tw from "@/lib/tailwind";

export default function Search() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <HeaderPageContainer>
      <View style={tw`pt-8 h-full`}>
        <ThemedTextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher du contenu, des utilisateurs, etc..."
          inputMode="search"
        />

        {searchQuery ? <SearchSection searchQuery={searchQuery} /> : <TopicsSection />}
      </View>
    </HeaderPageContainer>
  );
}
