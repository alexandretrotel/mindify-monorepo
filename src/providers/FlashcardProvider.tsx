"use client";
import "client-only";

import React from "react";

export const FlashcardContext = React.createContext({
  isOpenFlashcardScreen: false,
  setIsOpenFlashcardScreen: (isOpen: boolean) => {},
  currentCard: 1,
  setCurrentCard: (card: number) => {}
});

const FlashcardProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenFlashcardScreen, setIsOpenFlashcardScreen] = React.useState(false);
  const [currentCard, setCurrentCard] = React.useState(1);

  const value = React.useMemo(
    () => ({
      isOpenFlashcardScreen,
      setIsOpenFlashcardScreen,
      currentCard,
      setCurrentCard
    }),
    [currentCard, isOpenFlashcardScreen]
  );

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
};

export default FlashcardProvider;
