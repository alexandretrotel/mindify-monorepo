import H1 from "@/components/typography/h1";
import { Muted } from "@/components/typography/muted";
import Span from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex h-screen min-h-full items-center justify-center px-4">
      <div className="text-center">
  
        <H1>Page non trouvée</H1>
        <Muted>La page que vous recherchez n&apos;existe pas.</Muted>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/">Retourner à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
