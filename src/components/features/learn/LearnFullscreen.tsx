"use client";
import "client-only";

import React from "react";
import { FlashcardContext } from "@/providers/FlashcardProvider";
import Semibold from "@/components/typography/semibold";
import { Loader2Icon, XIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Flashcard from "@/components/features/learn/Flashcard";
import type { UUID } from "crypto";
import FlashcardSkeleton from "@/components/features/learn/skeleton/FlashcardSkeleton";
import { Button } from "@/components/ui/button";
import H1Span from "@/components/typography/h1AsSpan";
import H3Span from "@/components/typography/h3AsSpan";
import { Muted } from "@/components/typography/muted";
import { areMindsInitialized, getProgress, initializeSrsData } from "@/actions/srs-data";
import type { Tables } from "@/types/supabase";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

export default function LearnFullscreen({
  userId,
  userName,
  isConnected
}: {
  userId: UUID;
  userName: string;
  isConnected: boolean;
}) {
  const [needSrsInitialization, setNeedSrsInitialization] = React.useState(false);
  const [mindsNotInitialized, setMindsNotInitialized] = React.useState<
    (Tables<"minds"> & {
      summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
    })[]
  >([]);
  const [isInitializing, setIsInitializing] = React.useState(false);
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const [totalProgress, setTotalProgress] = React.useState(0);
  const [progressId] = React.useState(uuidv4());

  const { toast } = useToast();

  const {
    isOpenFlashcardScreen,
    setIsOpenFlashcardScreen,
    currentCard,
    totalLength,
    minds,
    areMindsLoading,
    finished,
    totalTime
  } = React.useContext(FlashcardContext);

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isInitializing) {
      intervalId = setInterval(async () => {
        const progress = await getProgress(progressId);
        setCurrentProgress(progress.current);
        setTotalProgress(progress.total);

        if (progress.current === progress.total) {
          clearInterval(intervalId);
          setIsInitializing(false);
        }
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [isInitializing, progressId]);

  React.useEffect(() => {
    const initializeSrs = async () => {
      const areMindsAllInitialized = await areMindsInitialized(userId, minds);
      setNeedSrsInitialization(!areMindsAllInitialized.initialized);
      setMindsNotInitialized(areMindsAllInitialized.mindsNotInitialized);
    };

    if (minds && userId) {
      initializeSrs();
    } else {
      setNeedSrsInitialization(false);
    }
  }, [minds, userId]);

  const handleInitializeSrs = async () => {
    setIsInitializing(true);

    try {
      await initializeSrsData(userId, mindsNotInitialized, progressId);
      setCurrentProgress(mindsNotInitialized.length);
      setNeedSrsInitialization(false);
    } catch (error) {
      console.error("Erreur lors de l'initialisation des SRS", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'initialisation du deck",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  if (areMindsLoading) {
    <div
      className={`fixed inset-0 z-50 h-screen w-full bg-background p-4 md:p-8 ${isOpenFlashcardScreen ? "block" : "hidden"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <Semibold>
          {currentCard}/{totalLength}
        </Semibold>

        <Progress
          value={currentCard === 1 ? 0 : (currentCard / totalLength) * 100}
          className="h-3 max-w-5xl"
        />

        <button
          onClick={() => setIsOpenFlashcardScreen(false)}
          className="rounded-full p-2 text-muted-foreground hover:bg-muted"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-full items-center justify-center">
        <FlashcardSkeleton />
      </div>
    </div>;
  }

  if (!minds) {
    return null;
  }

  if (needSrsInitialization) {
    return (
      <div
        className={`fixed inset-0 z-50 h-screen w-full bg-background p-4 md:p-8 ${isOpenFlashcardScreen ? "block" : "hidden"}`}
      >
        <div className="flex h-full items-center justify-center">
          <Card>
            <CardHeader>
              <div className="flex flex-col">
                <Semibold>Initialisation du deck</Semibold>
                <Muted size="sm">Vous avez {mindsNotInitialized.length} MINDS à apprendre.</Muted>
              </div>
            </CardHeader>

            <CardFooter>
              <Button className="w-full" disabled={isInitializing} onClick={handleInitializeSrs}>
                {isInitializing && <Loader2Icon className="mr-2 h-3 w-3 animate-spin" />}
                {isInitializing ? `${currentProgress}/${totalProgress}` : "Commencer"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

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

      <div className="flex h-full items-center justify-center">
        {finished ? (
          <div className="flex max-w-xl flex-col gap-8 text-center">
            <div className="flex flex-col">
              <H1Span>On est fier de vous !</H1Span>
              <H3Span>(Soyez fier aussi)</H3Span>
            </div>

            <Muted size="lg">
              Vous auriez pu passer{" "}
              <Semibold primaryColor size="lg">
                {totalTime}
              </Semibold>{" "}
              à scroller sur les réseaux. Mais c&apos;est{" "}
              <Semibold primaryColor size="lg">
                {totalLength}
              </Semibold>{" "}
              MINDS que vous avez appris.
            </Muted>

            <Button
              variant="outline"
              className="mx-auto w-fit"
              onClick={() => setIsOpenFlashcardScreen(false)}
            >
              Retourner au menu
            </Button>
          </div>
        ) : (
          <React.Fragment>
            {minds?.map((mind, index) => {
              if (index !== currentCard - 1) {
                return null;
              }

              return (
                <Flashcard
                  key={index}
                  mind={mind}
                  userId={userId}
                  userName={userName}
                  isConnected={isConnected}
                />
              );
            })}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
