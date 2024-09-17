"use client";
import "client-only";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";
import H1 from "@/components/typography/h1";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Muted } from "@/components/typography/muted";

export default function GlobalError({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const { toast } = useToast();

  useEffect(() => {
    Sentry.captureException(error);

    toast({
      title: error.name,
      description: error.message,
      variant: "destructive"
    });
  }, [error, toast]);

  return (
    <html lang="fr">
      <body>
        <main className="flex h-screen min-h-full items-center justify-center px-4">
          <div className="text-center">
            <H1>Une erreur est survenue</H1>
            <Muted>Essayez de recharger la page ou revenez plus tard.</Muted>

            <div className="mt-10 flex flex-col gap-4">
              <Button variant="secondary">
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
