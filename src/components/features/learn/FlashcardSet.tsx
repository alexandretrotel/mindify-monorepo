"use client";
import "client-only";

import H4Span from "@/components/typography/h4AsSpan";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import { FlashcardContext } from "@/providers/FlashcardProvider";
import Span from "@/components/typography/span";
import type { UUID } from "crypto";
import { getUserDueMindsFromDeck, getUserSavedMinds } from "@/actions/users";
import { useToast } from "@/components/ui/use-toast";

export default function FlashcardSet({
  title,
  description,
  flashcardSetId,
  userId,
  heightFull
}: Readonly<{
  title: string;
  description: string;
  flashcardSetId: number;
  userId: UUID;
  heightFull?: boolean;
}>) {
  const [isDue, setIsDue] = React.useState(false);

  const {
    setIsOpenFlashcardScreen,
    setMinds,
    setAreMindsLoading,
    setStartTime,
    setCurrentCard,
    setFinished,
    totalLength,
    setUserId
  } = React.useContext(FlashcardContext);

  const { toast } = useToast();

  React.useEffect(() => {
    const fetchMinds = async () => {
      setAreMindsLoading(true);

      if (flashcardSetId === 0) {
        try {
          const minds = await getUserSavedMinds(userId);
          const dueMinds = await getUserDueMindsFromDeck(userId, minds);

          if (!dueMinds || dueMinds.length === 0) {
            setMinds(minds);
          } else {
            setMinds(dueMinds);
            setIsDue(true);
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les cartes",
            variant: "destructive"
          });
        } finally {
          setAreMindsLoading(false);
        }
      }
    };

    if (userId) {
      fetchMinds();
    }
  }, [flashcardSetId, setAreMindsLoading, setMinds, setUserId, toast, userId]);

  const handleOpenFlashcardScreen = async () => {
    setIsOpenFlashcardScreen(true);
    setStartTime(Date.now());
    setCurrentCard(1);
    setFinished(false);
    setUserId(userId);
  };

  return (
    <Card className={`${heightFull ? "h-full max-h-56" : ""}`}>
      <CardHeader>
        <Span primaryColor size="xs">
          {totalLength} carte{totalLength > 1 ? "s" : ""} {isDue && "à réviser"}
        </Span>
        <H4Span>{title}</H4Span>
        <Muted size="sm">{description}</Muted>
      </CardHeader>

      <CardFooter>
        <Button className="w-full" onClick={handleOpenFlashcardScreen}>
          Réviser le set
        </Button>
      </CardFooter>
    </Card>
  );
}
