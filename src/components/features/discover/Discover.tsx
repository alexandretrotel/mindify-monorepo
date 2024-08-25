import React, { Suspense } from "react";
import Categories from "@/components/features/discover/Categories";
import Personalized from "@/components/features/discover/Personalized";
import Popular from "@/components/features/discover/Popular";
import SavedSummaries from "@/components/features/discover/SavedSummaries";
import CategoriesSkeleton from "@/components/features/discover/skeleton/CategoriesSkeleton";
import PersonalizedSkeleton from "@/components/features/discover/skeleton/PersonalizedSkeleton";
import PopularSkeleton from "@/components/features/discover/skeleton/PopularSkeleton";
import SavedSummariesSkeleton from "@/components/features/discover/skeleton/SavedSummariesSkeleton";
import PopularMinds from "@/components/features/discover/PopularMinds";
import PopularMindsSkeleton from "@/components/features/discover/skeleton/PopularMindsSkeleton";
import RandomMinds from "@/components/features/discover/RandomMinds";
import RandomMindsSkeleton from "@/components/features/discover/skeleton/randomMindsSkeleton";
import { UUID } from "crypto";
import MyActivity from "@/components/features/discover/MyActivity";
import MyActivitySkeleton from "@/components/features/discover/skeleton/MyActivitySkeleton";
import TopUsers from "@/components/features/discover/TopUsers";
import TopUsersSkeleton from "@/components/features/discover/skeleton/TopUsersSkeleton";

const Discover = async ({
  userId,
  isConnected,
  userName
}: {
  userId: UUID;
  isConnected: boolean;
  userName: string;
}) => {
  return (
    <div className="mx-auto flex w-full flex-col gap-8 md:gap-16 lg:justify-between">
      <div className="flex w-full flex-col gap-16">
        {isConnected && (
          <Suspense fallback={<MyActivitySkeleton />}>
            <MyActivity userId={userId} />
          </Suspense>
        )}

        {isConnected && (
          <Suspense fallback={<PersonalizedSkeleton />}>
            <Personalized userId={userId} />
          </Suspense>
        )}

        <Suspense fallback={<PopularMindsSkeleton />}>
          <PopularMinds userId={userId} isConnected={isConnected} userName={userName} />
        </Suspense>

        <Suspense fallback={<PopularSkeleton />}>
          <Popular />
        </Suspense>

        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories userId={userId} isConnected={isConnected} />
        </Suspense>

        <Suspense fallback={<RandomMindsSkeleton />}>
          <RandomMinds userId={userId} isConnected={isConnected} userName={userName} />
        </Suspense>

        {isConnected && (
          <Suspense fallback={<SavedSummariesSkeleton />}>
            <SavedSummaries userId={userId} />
          </Suspense>
        )}

        <Suspense fallback={<TopUsersSkeleton />}>
          <TopUsers />
        </Suspense>
      </div>
    </div>
  );
};

export default Discover;
