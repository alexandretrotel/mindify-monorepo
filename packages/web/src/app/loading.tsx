import { Muted } from "@/components/typography/muted";
import Semibold from "@/components/typography/semibold";
import Span from "@/components/typography/span";
import { citations } from "@/data/citations";
import { Loader2Icon } from "lucide-react";

export default function Loading() {
  const citation = citations[Math.floor(Math.random() * citations.length)];

  return (
    <main className="flex h-screen min-h-full items-center justify-center px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Span size="lg">{citation.citation}</Span>
          <Semibold size="sm">{citation.author}</Semibold>
        </div>

        <div className="flex items-center gap-2">
          <Loader2Icon className="h-4 w-4 animate-spin" />
          <Muted size="xs">Votre page est en cours de chargement.</Muted>
        </div>
      </div>
    </main>
  );
}
