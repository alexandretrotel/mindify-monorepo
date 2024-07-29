"use client";
import "client-only";

import { useEffect, useState } from "react";
import { calculateTimeLeft } from "@/utils/dates";
import type { TimeLeft } from "@/types/dates";
import TypographySemibold from "@/components/typography/semibold";
import TypographySpan from "@/components/typography/span";

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
        <TypographySpan center>
          Lancement prévu dans <TypographySemibold>0 jours</TypographySemibold>,{" "}
          <TypographySemibold>0 heures</TypographySemibold>,{" "}
          <TypographySemibold>0 minutes</TypographySemibold>, et{" "}
          <TypographySemibold>0 secondes</TypographySemibold>.
        </TypographySpan>
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
        <TypographySpan center>Mindify est maintenant disponible !</TypographySpan>
      </div>
    );
  }

  return (
    <div className="hidden w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 text-primary sm:px-3.5 md:flex">
      <TypographySpan center>
        Lancement prévu dans <TypographySemibold>{timeLeft.days || 0} jours</TypographySemibold>,{" "}
        <TypographySemibold>{timeLeft.hours || 0} heures</TypographySemibold>,{" "}
        <TypographySemibold>{timeLeft.minutes || 0} minutes</TypographySemibold>, et{" "}
        <TypographySemibold>{timeLeft.seconds || 0} secondes</TypographySemibold>.
      </TypographySpan>
    </div>
  );
}
