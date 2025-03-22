import { searchSummaries, searchUsers } from "@/actions/search.action";
import type { Tables } from "@/types/supabase";
import useDebounce from "@/hooks/global/utils/useDebounce";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * A hook that searches for users and summaries.
 *
 * @param searchQuery The search query.
 * @returns The searching state and search results.
 */
export default function useSearch(searchQuery: string) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    users: { id: string; name: string; avatar: string }[];
    summaries: (Tables<"summaries"> & {
      authors: Tables<"authors">;
    })[];
  }>({
    users: [],
    summaries: [],
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery) {
        setIsSearching(true);

        try {
          const [users, summaries] = await Promise.all([
            searchUsers(debouncedSearchQuery),
            searchSummaries(debouncedSearchQuery),
          ]);

          setSearchResults({ users, summaries });
        } catch (error) {
          console.error(error);
          Alert.alert("Une erreur est survenue lors de la recherche");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ users: [], summaries: [] });
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  return { isSearching, searchResults };
}
