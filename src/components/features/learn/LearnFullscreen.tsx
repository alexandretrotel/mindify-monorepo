"use client";
import "client-only";

import React from "react";
import { FlashcardContext } from "@/providers/FlashcardProvider";
import Semibold from "@/components/typography/semibold";
import { XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Flashcard from "@/components/features/learn/Flashcard";
import type { UUID } from "crypto";
import FlashcardSkeleton from "@/components/features/learn/skeleton/FlashcardSkeleton";
import { Button } from "@/components/ui/button";
import H1Span from "@/components/typography/h1AsSpan";
import H3Span from "@/components/typography/h3AsSpan";
import { Muted } from "@/components/typography/muted";

export default function LearnFullscreen({
  userId,
  userName,
  isConnected
}: Readonly<{
  userId: UUID;
  userName: string;
  isConnected: boolean;
}>) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [initialTotalLength, setInitialTotalLength] = React.useState(0);

  const {
    isOpenFlashcardScreen,
    setIsOpenFlashcardScreen,
    currentCard,
    totalLength,
    minds,
    areMindsLoading,
    finished,
    totalTime
  } = React.useContext(FlashcardContext);

  React.useEffect(() => {
    if (totalLength > 0 && (isOpenFlashcardScreen || !isMounted)) {
      setInitialTotalLength(totalLength);
      setIsMounted(true);
    }
  }, [isMounted, totalLength, isOpenFlashcardScreen]);

  if (areMindsLoading) {
    return (
      <div
        className={`fixed inset-0 z-50 h-screen w-full bg-background p-4 md:p-8 ${isOpenFlashcardScreen ? "block" : "hidden"}`}
      >
        <div className="flex items-center justify-between gap-4">
          <Semibold>
            {currentCard}/{initialTotalLength}
          </Semibold>

          <Progress
            value={currentCard === 1 ? 0 : (currentCard / initialTotalLength) * 100}
            className="h-3 max-w-5xl"
          />

          <button
            onClick={() => setIsOpenFlashcardScreen(false)}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-full items-center justify-center">
          <FlashcardSkeleton />
        </div>
      </div>
    );
  }

  if (!minds) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 h-screen w-full bg-background p-4 md:p-8 ${isOpenFlashcardScreen ? "block" : "hidden"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <Semibold>
          {currentCard}/{initialTotalLength}
        </Semibold>

        <Progress value={(currentCard / initialTotalLength) * 100} className="h-3 max-w-5xl" />

        <button
          onClick={() => setIsOpenFlashcardScreen(false)}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-full items-center justify-center">
        {finished ? (
          <div className="flex max-w-xl flex-col gap-8 text-center">
            <div className="flex flex-col">
              <H1Span>On est fier de vous !</H1Span>
              <H3Span>(Soyez fier aussi)</H3Span>
            </div>

            <Muted size="lg">
              Vous auriez pu passer{" "}
              <Semibold primaryColor size="lg">
                {totalTime}
              </Semibold>{" "}
              à scroller sur les réseaux. Mais c&apos;est{" "}
              <Semibold primaryColor size="lg">
                {initialTotalLength}
              </Semibold>{" "}
              MINDS que vous avez appris.
            </Muted>

            <Button
              variant="outline"
              className="mx-auto w-fit"
              onClick={() => setIsOpenFlashcardScreen(false)}
            >
              Retourner au menu
            </Button>
          </div>
        ) : (
          <React.Fragment>
            {minds?.map((mind, index) => {
              if (index !== currentCard - 1) {
                return null;
              }

              return (
                <Flashcard
                  key={index}
                  mind={mind}
                  userId={userId}
                  userName={userName}
                  isConnected={isConnected}
                />
              );
            })}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
