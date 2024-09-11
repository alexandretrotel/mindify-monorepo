import { UUID } from "crypto";
import { getUserReadingStreak } from "@/actions/users.action";

import React from "react";
import Semibold from "@/components/typography/semibold";
import { Muted } from "@/components/typography/muted";
import { FlameIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const ReadingStreak = async ({ userId, userName }: { userId: UUID; userName: string }) => {
  const { currentStreak: readingStreak, longestStreak } = await getUserReadingStreak(userId);

  return (
    <Dialog>
      <DialogTrigger>
        <Muted size="sm">
          <span className="flex items-center">
            <Semibold>{readingStreak}</Semibold> <FlameIcon className="h-4 w-4" />
          </span>
        </Muted>
      </DialogTrigger>

      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left">Série de lecture</DialogTitle>

          <DialogDescription className="text-left">
            {userName} a une série de lecture de <Semibold>{readingStreak}</Semibold> jours
            consécutifs actuellement et sa plus longue série est de{" "}
            <Semibold>{longestStreak}</Semibold> jours.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ReadingStreak;
