"use client";
import "client-only";

import React from "react";

export const FlashcardContext = React.createContext({
  isOpenFlashcardScreen: false,
  setIsOpenFlashcardScreen: (isOpen: boolean) => {},
  currentCard: 1,
  setCurrentCard: (card: number) => {},
  totalLength: 0,
  setTotalLength: (length: number) => {}
});

const FlashcardProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenFlashcardScreen, setIsOpenFlashcardScreen] = React.useState(false);
  const [currentCard, setCurrentCard] = React.useState(1);
  const [totalLength, setTotalLength] = React.useState(0);

  const value = React.useMemo(
    () => ({
      isOpenFlashcardScreen,
      setIsOpenFlashcardScreen,
      currentCard,
      setCurrentCard,
      totalLength,
      setTotalLength
    }),
    [currentCard, isOpenFlashcardScreen, totalLength]
  );

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
};

export default FlashcardProvider;
