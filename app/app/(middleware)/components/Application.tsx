"use client";
import "client-only";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Library from "@/app/app/(middleware)/components/tabs/Library";
import type { Topics } from "@/types/topics/topics";
import Discover from "@/app/app/(middleware)/components/tabs/Discover";
import AccountDropdown from "@/components/global/AccountDropdown";
import type { Authors, Summaries } from "@/types/summary/summary";
import type { UserReads, UserLibrary } from "@/types/user";

export default function Application({
  children,
  topics,
  userTopics,
  summaries,
  userReads,
  authors,
  userLibrary
}: Readonly<{
  children?: React.ReactNode;
  topics: Topics;
  userTopics: Topics;
  summaries: Summaries;
  userReads: UserReads;
  authors: Authors;
  userLibrary: UserLibrary;
}>) {
  return (
    <Tabs defaultValue="discover" className="flex flex-col gap-6 md:gap-12">
      <header className="flex w-full items-center justify-between">
        <TabsList className="grid grid-cols-2 md:w-1/2">
          <TabsTrigger value="discover">Découvrir</TabsTrigger>
          <TabsTrigger value="my-library">Librairie</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <AccountDropdown />
        </div>
      </header>

      <main>
        <TabsContent value="discover">
          <Discover
            topics={topics}
            userTopics={userTopics}
            summaries={summaries}
            userReads={userReads}
            userLibrary={userLibrary}
          />
        </TabsContent>

        <TabsContent value="my-library">
          <Library
            topics={topics}
            summaries={summaries}
            authors={authors}
            userReads={userReads}
            userLibrary={userLibrary}
          />
        </TabsContent>
        {children}
      </main>
    </Tabs>
  );
}
