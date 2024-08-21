import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Library from "@/components/features/library/Library";
import Discover from "@/components/features/discover/Discover";
import AccountDropdown from "@/components/global/AccountDropdown";
import LibrarySkeleton from "@/components/features/library/skeleton/LibrarySkeleton";
import { Suspense } from "react";
import type { SummaryStatus } from "@/types/summary";
import type { Enums } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams
}: Readonly<{
  searchParams: { search: string; topic: string; source: Enums<"source">; status: SummaryStatus };
}>) {
  const { search, topic, source, status } = searchParams;

  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const userId = data?.user?.id as UUID;
  const userMetadata = data?.user?.user_metadata;

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
          <AccountDropdown userId={userId} userMetadata={userMetadata} />
        </div>
      </header>

      <main>
        <TabsContent value="discover">
          <Discover userId={userId} />
        </TabsContent>

        <TabsContent value="library">
          <Suspense fallback={<LibrarySkeleton />}>
            <Library
              initialSearch={search}
              initialTopic={topic}
              initialSource={source}
              initialStatus={status}
              userId={userId}
            />
          </Suspense>
        </TabsContent>
      </main>
    </Tabs>
  );
}
