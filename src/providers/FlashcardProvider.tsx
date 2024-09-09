"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";

export const FlashcardContext = React.createContext({
  isOpenFlashcardScreen: false,
  setIsOpenFlashcardScreen: (isOpen: boolean) => {},
  currentCard: 1,
  setCurrentCard: (card: number) => {},
  totalLength: 0,
  setTotalLength: (length: number) => {},
  minds: [] as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[],
  setMinds: (
    minds: (Tables<"minds"> & {
      summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
    })[]
  ) => {},
  areMindsLoading: false,
  setAreMindsLoading: (isLoading: boolean) => {},
  finished: false,
  setFinished: (isFinished: boolean) => {},
  startTime: 0,
  setStartTime: (time: number) => {},
  endTime: 0,
  setEndTime: (time: number) => {},
  totalTime: "",
  setTotalTime: (time: string) => {},
  isActive: true,
  inactiveTime: 0,
  setInactiveTime: (time: number) => {}
});

const FlashcardProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenFlashcardScreen, setIsOpenFlashcardScreen] = React.useState(false);
  const [currentCard, setCurrentCard] = React.useState(1);
  const [totalLength, setTotalLength] = React.useState(0);
  const [minds, setMinds] = React.useState<
    (Tables<"minds"> & {
      summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
    })[]
  >([]);
  const [areMindsLoading, setAreMindsLoading] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [startTime, setStartTime] = React.useState(0);
  const [endTime, setEndTime] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);
  const [inactiveTime, setInactiveTime] = React.useState(0);

  const inactivityTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactiveStartRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (finished) {
      setEndTime(Date.now());
    }
  }, [finished]);

  React.useEffect(() => {
    if (startTime && endTime && startTime > 0 && endTime > 0) {
      const totalTimeInMs = endTime - startTime - inactiveTime;
      const totalTime = new Date(totalTimeInMs > 0 ? totalTimeInMs : 0);

      const minutes = totalTime.getUTCMinutes().toString().padStart(2, "0");
      const seconds = totalTime.getUTCSeconds().toString().padStart(2, "0");

      let formattedTime = "";
      if (minutes === "00" && seconds === "00") {
        formattedTime = "0s";
      } else if (minutes === "00") {
        formattedTime = `${parseInt(seconds)}s`;
      } else {
        const formattedSeconds = seconds.startsWith("0") ? seconds.slice(1) : seconds;
        formattedTime = `${parseInt(minutes)}m ${formattedSeconds}s`;
      }

      setTotalTime(formattedTime);
    } else {
      setTotalTime("0s");
    }
  }, [startTime, endTime]);

  React.useEffect(() => {
    const handleUserActivity = () => {
      setIsActive(true);

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }

      if (inactiveStartRef.current) {
        const inactiveDuration = Date.now() - inactiveStartRef.current;
        setInactiveTime((prev) => prev + inactiveDuration);
        inactiveStartRef.current = null;
      }

      if (inactiveStartRef.current) {
        inactivityTimeoutRef.current = setTimeout(() => {
          setIsActive(false);
          inactiveStartRef.current = Date.now();
        }, 10000);
      }
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }
    };
  }, []);

  const value = React.useMemo(
    () => ({
      isOpenFlashcardScreen,
      setIsOpenFlashcardScreen,
      currentCard,
      setCurrentCard,
      totalLength,
      setTotalLength,
      minds,
      setMinds,
      areMindsLoading,
      setAreMindsLoading,
      finished,
      setFinished,
      startTime,
      setStartTime,
      endTime,
      setEndTime,
      totalTime,
      setTotalTime,
      isActive,
      inactiveTime,
      setInactiveTime
    }),
    [
      currentCard,
      isOpenFlashcardScreen,
      minds,
      totalLength,
      areMindsLoading,
      finished,
      startTime,
      endTime,
      totalTime,
      isActive,
      inactiveTime
    ]
  );

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
};

export default FlashcardProvider;
