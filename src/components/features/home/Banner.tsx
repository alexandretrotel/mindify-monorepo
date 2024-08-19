"use client";
import "client-only";

import { useEffect, useState } from "react";
import { calculateTimeLeft } from "@/utils/dates";
import type { TimeLeft } from "@/types/dates";
import Semibold from "@/components/typography/semibold";
import Span from "@/components/typography/span";

const launchDate: Date = new Date("2024-09-02T12:00:00Z");

export default function Banner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | undefined>(undefined);

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
      <div className="hidden w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 text-center sm:px-3.5 md:flex">
        <Span onPrimaryBackground center>
          Lancement prévu dans <Semibold>0 jours</Semibold>, <Semibold>0 heures</Semibold>,{" "}
          <Semibold>0 minutes</Semibold>, et <Semibold>0 secondes</Semibold>.
        </Span>
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
      <div className="hidden w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 text-center sm:px-3.5 md:flex">
        <Span onPrimaryBackground center>
          Mindify est maintenant disponible !
        </Span>
      </div>
    );
  }

  return (
    <div className="hidden w-full items-center justify-center gap-x-6 bg-primary px-6 py-2.5 sm:px-3.5 md:flex">
      <Span onPrimaryBackground center>
        Lancement prévu dans <Semibold>{timeLeft.days || 0} jours</Semibold>,{" "}
        <Semibold>{timeLeft.hours || 0} heures</Semibold>,{" "}
        <Semibold>{timeLeft.minutes || 0} minutes</Semibold>, et{" "}
        <Semibold>{timeLeft.seconds || 0} secondes</Semibold>.
      </Span>
    </div>
  );
}
