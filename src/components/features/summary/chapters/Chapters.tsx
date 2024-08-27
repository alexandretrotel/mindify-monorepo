import React from "react";
import H2 from "@/components/typography/h2";
import P from "@/components/typography/p";
import type { Tables } from "@/types/supabase";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import H3Span from "@/components/typography/h3AsSpan";
import Semibold from "@/components/typography/semibold";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Chapters = async ({
  chapters,
  introduction,
  conclusion,
  isConnected
}: {
  chapters: Tables<"chapters">;
  introduction: string;
  conclusion: string;
  isConnected: boolean;
}) => {
  return (
    <React.Fragment>
      <div id="introduction" className="flex flex-col gap-4">
        <H2>Introduction</H2>
        <P size="lg">{introduction}</P>
      </div>

      {isConnected ? (
        <React.Fragment>
          <div className="flex flex-col gap-8">
            {chapters?.titles?.map((title, index) => (
              <div key={title} id={"chapter" + String(index + 1)} className="flex flex-col gap-4">
                <H2>{title}</H2>
                <P size="lg">{chapters?.texts[index]}</P>
              </div>
            ))}
          </div>
          <div id="conclusion" className="flex flex-col gap-4">
            <H2>Conclusion</H2>
            <P size="lg">{conclusion}</P>
          </div>
        </React.Fragment>
      ) : (
        <Card>
          <CardHeader>
            <H3Span>Connectez-vous pour lire le contenu</H3Span>
          </CardHeader>

          <CardContent>
            <Semibold>
              Pour lire le contenu de ce résumé, vous devez être connecté et être abonné à Mindify
              Pro.
            </Semibold>
          </CardContent>

          <CardFooter>
            <Button asChild>
              <Link href="/auth/login" className="text-foreground">
                Se connecter
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </React.Fragment>
  );
};

export default Chapters;
