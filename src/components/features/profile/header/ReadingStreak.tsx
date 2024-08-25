import { UUID } from "crypto";
import { getUserReadingStreak } from "@/actions/users";

import React from "react";
import Semibold from "@/components/typography/semibold";
import { Muted } from "@/components/typography/muted";

const ReadingStreak = async ({ userId }: { userId: UUID }) => {
  const { currentStreak: readingStreak, todayInStreak } = await getUserReadingStreak(userId);

  return (
    <Muted size="sm">
      <Semibold>{readingStreak}</Semibold> jour{readingStreak > 1 && "s"} consécutif
      {readingStreak > 1 && "s"}
    </Muted>
  );
};

export default ReadingStreak;
