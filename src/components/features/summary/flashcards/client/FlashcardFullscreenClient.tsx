"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";
import SummaryFlashcardMind from "@/components/features/summary/flashcards/SummaryFlashcardMind";
import type { UUID } from "crypto";

const FlashcardScreenClient = ({
  minds,
  initialAreSaved,
  userId,
  userName,
  isConnected
}: {
  minds: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  })[];
  initialAreSaved: boolean[];
  userId: UUID;
  userName: string;
  isConnected: boolean;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [currentCard, setCurrentCard] = React.useState(1);

  const handleFullscreen = () => {
    setIsOpen(!isOpen);
  };

  const handleNext = () => {
    if (currentCard - 1 < minds.length) {
      setCurrentCard(currentCard + 1);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-background p-16 px-4">
      {minds.map((mind, index) => {
        if (index !== currentCard - 1) {
          return null;
        }

        return (
          <SummaryFlashcardMind
            key={mind.id}
            mind={mind}
            index={index}
            totalLength={minds.length}
            handleFullscreen={handleFullscreen}
            handleNext={handleNext}
            initialIsSaved={initialAreSaved[index]}
            userId={userId}
            userName={userName}
            isConnected={isConnected}
          />
        );
      })}
    </div>
  );
};

export default FlashcardScreenClient;
