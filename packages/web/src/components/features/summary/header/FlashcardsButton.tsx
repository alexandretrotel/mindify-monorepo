"use client";
import "client-only";

import React from "react";
import PulsatingButton from "@/components/magicui/pulsating-button";
import { FlashcardContext } from "@/providers/FlashcardProvider";
import { Button } from "@/components/ui/button";

const FlashcardsButton = ({
  children,
  pulsate
}: {
  children: React.ReactNode;
  pulsate?: boolean;
}) => {
  const { setIsOpenFlashcardScreen, setCurrentCard } = React.useContext(FlashcardContext);

  const handleOpenFlashcardScreen = () => {
    setIsOpenFlashcardScreen(true);
    setCurrentCard(1);
  };

  if (!pulsate) {
    return (
      <Button onClick={handleOpenFlashcardScreen} className="w-full md:w-fit">
        {children}
      </Button>
    );
  }

  return (
    <PulsatingButton
      onClick={handleOpenFlashcardScreen}
      pulseColor="#16a34a"
      className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 md:w-fit"
    >
      {children}
    </PulsatingButton>
  );
};

export default FlashcardsButton;
