"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";
import SummaryFlashcardMind from "@/components/features/summary/flashcards/SummaryFlashcardMind";
import type { UUID } from "crypto";
import { FlashcardContext } from "@/providers/FlashcardProvider";
import Doodle1 from "@/../public/doodles/doodle-1.svg";
import Doodle2 from "@/../public/doodles/doodle-2.svg";
import Doodle3 from "@/../public/doodles/doodle-3.svg";
import Doodle5 from "@/../public/doodles/doodle-5.svg";
import Image from "next/image";

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
  const { isOpenFlashcardScreen, setIsOpenFlashcardScreen, currentCard, setCurrentCard } =
    React.useContext(FlashcardContext);

  const handleFullscreen = () => {
    setIsOpenFlashcardScreen(!isOpenFlashcardScreen);
  };

  const handleNext = () => {
    if (currentCard - 1 < minds.length) {
      setCurrentCard(currentCard + 1);
    }
  };

  if (!isOpenFlashcardScreen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-background p-16 px-4">
      <div className="relative flex h-full w-full items-center justify-center">
        <Image
          src={Doodle2}
          alt="Doodle 2"
          className="absolute right-10 top-8 hidden -translate-x-24 rotate-[15deg] scale-50 text-primary lg:block"
        />
        <Image
          src={Doodle3}
          alt="Doodle 3"
          className="absolute inset-x-0 left-16 hidden translate-y-32 rotate-3 scale-50 lg:block"
        />
        <Image
          src={Doodle5}
          alt="Doodle 5"
          className="absolute bottom-12 right-12 hidden -translate-x-12 rotate-12 scale-50 lg:block"
        />

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
    </div>
  );
};

export default FlashcardScreenClient;
