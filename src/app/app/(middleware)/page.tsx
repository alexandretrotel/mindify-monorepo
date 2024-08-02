import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Library from "@/app/app/(middleware)/components/tabs/Library";
import Discover from "@/app/app/(middleware)/components/tabs/Discover";
import AccountDropdown from "@/components/global/AccountDropdown";
import LibrarySkeleton from "@/app/app/(middleware)/components/skeleton/LibrarySkeleton";
import { Suspense } from "react";
import type { SummaryStatus } from "@/types/summary";
import type { Enums } from "@/types/supabase";

export default async function Home({
  searchParams
}: Readonly<{
  searchParams: { search: string; topic: string; source: Enums<"source">; status: SummaryStatus };
}>) {
  const { search, topic, source, status } = searchParams;

  return (
    <Tabs defaultValue={"discover"} className="flex flex-col gap-6 md:gap-12">
      <header className="flex w-full items-center justify-between">
        <TabsList className="grid grid-cols-2 md:w-1/2">
          <TabsTrigger value="discover" className="w-full">
            Découvrir
          </TabsTrigger>

          <TabsTrigger value="library" className="w-full">
            Librairie
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <AccountDropdown />
        </div>
      </header>

      <main>
        <TabsContent value="discover">
          <Discover />
        </TabsContent>

        <TabsContent value="library">
          <Suspense fallback={<LibrarySkeleton />}>
            <Library
              initialSearch={search}
              initialTopic={topic}
              initialSource={source}
              initialStatus={status}
            />
          </Suspense>
        </TabsContent>
      </main>
    </Tabs>
  );
}
