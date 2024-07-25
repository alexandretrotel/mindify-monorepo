"use client";
import "client-only";

import type { UserMetadata } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Library from "@/components/application/tabs/library";
import type { Topics } from "@/types/topics/topics";
import { UUID } from "crypto";
import Discover from "@/components/application/tabs/discover";
import AccountDropdown from "@/components/global/accountDropdown";
import type { Authors, Summaries } from "@/types/summary/summary";
import type { UserReads, UserSummaryStatuses } from "@/types/user";

export default function Application({
  children,
  userId,
  userMetadata,
  topics,
  userTopics,
  summaries,
  userReads,
  authors,
  userSummaryStatuses
}: Readonly<{
  children?: React.ReactNode;
  userId: UUID;
  userMetadata: UserMetadata;
  topics: Topics;
  userTopics: Topics;
  summaries: Summaries;
  userReads: UserReads;
  authors: Authors;
  userSummaryStatuses: UserSummaryStatuses;
}>) {
  return (
    <div className="md:flew-row mx-auto flex w-full max-w-7xl flex-col justify-between p-4 py-12 md:p-8">
      <Tabs defaultValue="discover" className="flex flex-col gap-6 md:gap-12">
        <header className="flex w-full items-center justify-between">
          <TabsList className="grid grid-cols-2 md:w-1/2">
            <TabsTrigger value="discover">Découvrir</TabsTrigger>
            <TabsTrigger value="my-library">Librairie</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <AccountDropdown
              userMetadata={userMetadata}
              userId={userId}
              topics={topics}
              userTopics={userTopics}
            />
          </div>
        </header>

        <main>
          <TabsContent value="discover">
            <Discover
              topics={topics}
              userTopics={userTopics}
              summaries={summaries}
              userReads={userReads}
            />
          </TabsContent>

          <TabsContent value="my-library">
            <Library
              topics={topics}
              summaries={summaries}
              authors={authors}
              userSummaryStatuses={userSummaryStatuses}
            />
          </TabsContent>
          {children}
        </main>
      </Tabs>
    </div>
  );
}
