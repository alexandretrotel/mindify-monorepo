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
import { getUserSavedMinds } from "@/actions/users";
import { useToast } from "@/components/ui/use-toast";

export default function FlashcardSet({
  title,
  description,
  totalLength,
  flashcardSetId,
  userId
}: Readonly<{
  title: string;
  description: string;
  totalLength: number;
  flashcardSetId: number;
  userId: UUID;
}>) {
  const { setIsOpenFlashcardScreen, setTotalLength, setMinds, setAreMindsLoading } =
    React.useContext(FlashcardContext);

  const { toast } = useToast();

  const handleOpenFlashcardScreen = async () => {
    setIsOpenFlashcardScreen(true);
    setTotalLength(totalLength);
    setAreMindsLoading(true);

    if (flashcardSetId === 0) {
      try {
        const minds = await getUserSavedMinds(userId);
        setMinds(minds);
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

    setAreMindsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <Span primaryColor size="xs">
          {totalLength} cartes
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
