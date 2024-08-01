import Span from "@/components/typography/span";
import { UUID } from "crypto";
import { FlameIcon } from "lucide-react";
import { getUserReadingStreak } from "@/actions/users";

import React from "react";
import ResponsiveTooltip from "@/components/global/ResponsiveTooltip";
import Semibold from "@/components/typography/semibold";

const ReadingStreak = async ({ profileId }: { profileId: UUID }) => {
  const { currentStreak: readingStreak, todayInStreak } = await getUserReadingStreak(profileId);

  if (!readingStreak) {
    return;
  }

  if (readingStreak === 0 || !todayInStreak) {
    return;
  }

  return (
    <div className="flex items-center gap-2">
      <Span>•</Span>

      <Semibold>
        <ResponsiveTooltip
          text="Nombre de jours consécutifs de lecture."
          side="bottom"
          align="center"
          cursor="help"
        >
          <div className="flex items-center">
            {readingStreak}
            <FlameIcon className="h-4 w-4" />
          </div>
        </ResponsiveTooltip>
      </Semibold>
    </div>
  );
};

export default ReadingStreak;
