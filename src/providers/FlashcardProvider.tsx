"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";

export const FlashcardContext = React.createContext({
  isOpenFlashcardScreen: false,
  setIsOpenFlashcardScreen: (isOpen: boolean) => {},
  currentCard: 1,
  setCurrentCard: (card: number) => {},
  totalLength: 0,
  setTotalLength: (length: number) => {},
  minds: [] as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[],
  setMinds: (
    minds: (Tables<"minds"> & {
      summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
    })[]
  ) => {},
  areMindsLoading: false,
  setAreMindsLoading: (isLoading: boolean) => {}
});

const FlashcardProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenFlashcardScreen, setIsOpenFlashcardScreen] = React.useState(false);
  const [currentCard, setCurrentCard] = React.useState(1);
  const [totalLength, setTotalLength] = React.useState(0);
  const [minds, setMinds] = React.useState<
    (Tables<"minds"> & {
      summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
    })[]
  >([]);
  const [areMindsLoading, setAreMindsLoading] = React.useState(false);

  const value = React.useMemo(
    () => ({
      isOpenFlashcardScreen,
      setIsOpenFlashcardScreen,
      currentCard,
      setCurrentCard,
      totalLength,
      setTotalLength,
      minds,
      setMinds,
      areMindsLoading,
      setAreMindsLoading
    }),
    [currentCard, isOpenFlashcardScreen, minds, totalLength, areMindsLoading]
  );

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
};

export default FlashcardProvider;
