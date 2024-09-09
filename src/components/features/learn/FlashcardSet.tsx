"use client";
import "client-only";

import H4Span from "@/components/typography/h4AsSpan";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import { FlashcardContext } from "@/providers/FlashcardProvider";

export default function FlashcardSet({
  title,
  description,
  totalLength
}: Readonly<{ title: string; description: string; totalLength: number }>) {
  const { setIsOpenFlashcardScreen, setTotalLength } = React.useContext(FlashcardContext);

  const handleOpenFlashcardScreen = () => {
    setIsOpenFlashcardScreen(true);
    setTotalLength(totalLength);
  };

  return (
    <Card>
      <CardHeader>
        <H4Span>{title}</H4Span>
        <Muted>{description}</Muted>
      </CardHeader>

      <CardFooter>
        <Button onClick={handleOpenFlashcardScreen}>Réviser le set</Button>
      </CardFooter>
    </Card>
  );
}
