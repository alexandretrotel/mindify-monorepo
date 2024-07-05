"use client";

import TypographyP from "@/components/typography/p";
import { useEffect, useState } from "react";
import { calculateTimeLeft } from "@/utils/time/dates";
import type { TimeLeft } from "@/types/time/dates";
import TypographySemibold from "@/components/typography/semibold";

const launchDate: Date = new Date("2024-09-02T12:00:00Z");

export default function Banner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft(launchDate));
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (!timeLeft) {
    return (
      <div className="hidden w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 text-center text-primary sm:px-3.5 md:flex">
        <TypographyP center>
          Lancement prévu dans <TypographySemibold>0 jours</TypographySemibold>,{" "}
          <TypographySemibold>0 heures</TypographySemibold>,{" "}
          <TypographySemibold>0 minutes</TypographySemibold>, et{" "}
          <TypographySemibold>0 secondes</TypographySemibold>.
        </TypographyP>
      </div>
    );
  }

  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return (
      <div className="hidden w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 text-center text-primary sm:px-3.5 md:flex">
        <TypographyP center>Mindify est maintenant disponible !</TypographyP>
      </div>
    );
  }

  return (
    <div className="hidden w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 text-primary sm:px-3.5 md:flex">
      <TypographyP center>
        Lancement prévu dans <TypographySemibold>{timeLeft.days || 0} jours</TypographySemibold>,{" "}
        <TypographySemibold>{timeLeft.hours || 0} heures</TypographySemibold>,{" "}
        <TypographySemibold>{timeLeft.minutes || 0} minutes</TypographySemibold>, et{" "}
        <TypographySemibold>{timeLeft.seconds || 0} secondes</TypographySemibold>.
      </TypographyP>
    </div>
  );
}
