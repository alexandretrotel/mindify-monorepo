import React from "react";

export const SearchContext = React.createContext({
  searchQuery: "",
  setSearchQuery: (query: string) => {},
});

export default function SearchProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const value = React.useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
    }),
    [searchQuery],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export const useSearch = () => {
  const context = React.useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return context;
};
