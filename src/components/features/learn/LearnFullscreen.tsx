"use client";
import "client-only";

import React from "react";
import { FlashcardContext } from "@/providers/FlashcardProvider";
import Semibold from "@/components/typography/semibold";
import { XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LearnFullscreen() {
  const { isOpenFlashcardScreen, setIsOpenFlashcardScreen, currentCard, totalLength } =
    React.useContext(FlashcardContext);

  return (
    <div
      className={`fixed inset-0 z-50 h-screen w-full bg-background p-4 md:p-8 ${isOpenFlashcardScreen ? "block" : "hidden"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <Semibold>
          {currentCard}/{totalLength}
        </Semibold>

        <Progress value={(currentCard / totalLength) * 100} className="h-3 max-w-5xl" />

        <button
          onClick={() => setIsOpenFlashcardScreen(false)}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-full items-center justify-center">d</div>
    </div>
  );
}
