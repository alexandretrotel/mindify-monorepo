"use client";
import TypographySpan from "@/components/typography/span";
import "client-only";
import { UUID } from "crypto";
import { FlameIcon } from "lucide-react";
import { getUserReadingStreak } from "@/actions/user";

import React from "react";
import ResponsiveTooltip from "@/components/global/responsiveTooltip";

const ReadingStreak = ({ profileId }: { profileId: UUID }) => {
  const [readingStreak, setReadingStreak] = React.useState<number | null>(null);

  React.useEffect(() => {
    const fetchReadingStreak = async () => {
      const readingStreak = await getUserReadingStreak({ userId: profileId });
      setReadingStreak(readingStreak);
    };

    fetchReadingStreak();
  }, [profileId]);

  if (!readingStreak) {
    return;
  }

  if (readingStreak === 0) {
    return;
  }

  return (
    <div className="flex items-center gap-2">
      <TypographySpan isDefaultColor>•</TypographySpan>

      <TypographySpan isDefaultColor semibold>
        <ResponsiveTooltip
          text="Ce chiffre représente le nombre de jours consécutifs de lecture."
          side="bottom"
          align="center"
          cursor="help"
        >
          <div className="flex items-center">
            {readingStreak}
            <FlameIcon className="h-4 w-4" />
          </div>
        </ResponsiveTooltip>
      </TypographySpan>
    </div>
  );
};

export default ReadingStreak;
