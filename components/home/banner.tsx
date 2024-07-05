"use client";

import TypographyP from "@/components/typography/p";
import { useEffect, useState } from "react";
import { calculateTimeLeft } from "@/utils/time/dates";
import type { TimeLeft } from "@/types/time/dates";
import TypographySemibold from "@/components/typography/semibold";

const launchDate: Date = new Date("2024-09-02T12:00:00Z");

export default function Banner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(launchDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(launchDate));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return (
      <div className="flex w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 text-primary sm:px-3.5">
        <TypographyP>Mindify est maintenant disponible !</TypographyP>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 text-primary sm:px-3.5">
      <TypographyP>
        Lancement prévu dans <TypographySemibold>{timeLeft.days || 0} jours</TypographySemibold>,{" "}
        <TypographySemibold>{timeLeft.hours || 0} heures</TypographySemibold>,{" "}
        <TypographySemibold>{timeLeft.minutes || 0} minutes</TypographySemibold>, et{" "}
        <TypographySemibold>{timeLeft.seconds || 0} secondes</TypographySemibold>.
      </TypographyP>
    </div>
  );
}
