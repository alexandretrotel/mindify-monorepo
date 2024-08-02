"use client";
import "client-only";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";
import Span from "@/components/typography/span";
import H1 from "@/components/typography/h1";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <main className="flex h-screen min-h-full items-center justify-center">
          <div className="text-center">
            <Span primaryColor>Erreur</Span>
            <H1>Une erreur est survenue</H1>
            <Span>Essayez de recharger la page ou revenez plus tard.</Span>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Button asChild onClick={reset}>
                Réessayer
              </Button>

              <Button variant="secondary">
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
            </div>
          </div>
        </main>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
