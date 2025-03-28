"use client";
import "client-only";

import Semibold from "@/components/typography/semibold";
import Span from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import ReactCardFlip from "react-card-flip";
import BlackTransparentLogo from "@/../public/logos/mindify-black-transparent.svg";
import WhiteTransparentLogo from "@/../public/logos/mindify-white-transparent.svg";
import Image from "next/image";
import { useTheme } from "next-themes";

const mind = {
  title: "Atomic habits",
  author: "James Clear",
  question: "Comment quitter mes mauvaises habitudes ?",
  answer:
    "Pour changer une habitude, il faut la remplacer par une autre. Pour cela, il faut identifier le déclencheur de la mauvaise habitude, puis la remplacer par une habitude plus saine."
};

const LandingFlashcardClient = () => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const { resolvedTheme } = useTheme();

  const showBack = () => {
    setIsFlipped(true);
  };

  const showFront = () => {
    setIsFlipped(false);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <Front onFlip={showBack} theme={resolvedTheme as string} />
      <Back onFlip={showFront} theme={resolvedTheme as string} />
    </ReactCardFlip>
  );
};

function Front({ onFlip, theme }: Readonly<{ onFlip: () => void; theme: string }>) {
  return (
    <Card className="flex w-full min-w-80 max-w-xs flex-col lg:min-w-96">
      <div className="flex h-full min-h-[28rem] flex-col justify-between gap-8 lg:min-h-[32rem]">
        <CardHeader>
          <div className="flex items-center justify-between gap-8">
            <div className="flex flex-col">
              <Semibold>{mind.title}</Semibold>
              <Span size="sm">{mind.author}</Span>
            </div>

            <Logo theme={theme} />
          </div>
        </CardHeader>

        <CardContent>
          <Semibold size="lg">{mind.question}</Semibold>
        </CardContent>

        <CardFooter>
          <Button className="w-full" variant="outline" onClick={onFlip}>
            Essayez-moi
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

function Back({ onFlip, theme }: Readonly<{ onFlip: () => void; theme: string }>) {
  return (
    <Card className="flex w-full min-w-80 max-w-xs flex-col lg:min-w-96">
      <div className="flex h-full min-h-[28rem] flex-col justify-between gap-8 lg:min-h-[32rem]">
        <CardHeader>
          <div className="flex items-center justify-between gap-8">
            <div className="flex flex-col">
              <Semibold>{mind.title}</Semibold>
              <Span size="sm">{mind.author}</Span>
            </div>

            <Logo theme={theme} />
          </div>
        </CardHeader>

        <CardContent>
          <Semibold size="lg">{mind.answer}</Semibold>
        </CardContent>

        <CardFooter>
          <Button className="w-full" variant="outline" onClick={onFlip}>
            Retourner à la question
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

function Logo({ theme }: Readonly<{ theme: string }>) {
  const size = 28;

  return (
    <React.Fragment>
      {theme === "light" ? (
        <Image src={BlackTransparentLogo} alt="Mindify" width={size} height={size} />
      ) : (
        <Image src={WhiteTransparentLogo} alt="Mindify" width={size} height={size} />
      )}
    </React.Fragment>
  );
}

export default LandingFlashcardClient;
