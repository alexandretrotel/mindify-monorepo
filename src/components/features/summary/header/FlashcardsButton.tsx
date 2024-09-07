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
  const { setIsOpenFlashcardScreen } = React.useContext(FlashcardContext);

  if (!pulsate) {
    return (
      <Button onClick={() => setIsOpenFlashcardScreen(true)} className="w-full md:w-fit">
        {children}
      </Button>
    );
  }

  return (
    <PulsatingButton
      onClick={() => setIsOpenFlashcardScreen(true)}
      pulseColor="#16a34a"
      className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 md:w-fit"
    >
      {children}
    </PulsatingButton>
  );
};

export default FlashcardsButton;
