import React, { Suspense } from "react";
import Statistics from "@/app/app/components/tabs/discover/Statistics";
import Categories from "@/app/app/components/tabs/discover/Categories";
import Personalized from "@/app/app/components/tabs/discover/Personalized";
import Popular from "@/app/app/components/tabs/discover/Popular";
import SavedSummaries from "@/app/app/components/tabs/discover/SavedSummaries";
import CategoriesSkeleton from "@/app/app/components/tabs/discover/skeleton/CategoriesSkeleton";
import PersonalizedSkeleton from "@/app/app/components/tabs/discover/skeleton/PersonalizedSkeleton";
import PopularSkeleton from "@/app/app/components/tabs/discover/skeleton/PopularSkeleton";
import SavedSummariesSkeleton from "@/app/app/components/tabs/discover/skeleton/SavedSummariesSkeleton";
import StatisticsSkeleton from "@/app/app/components/tabs/discover/skeleton/StatisticsSkeleton";
import PopularMinds from "@/app/app/components/tabs/discover/PopularMinds";
import PopularMindsSkeleton from "@/app/app/components/tabs/discover/skeleton/PopularMindsSkeleton";
import RandomMinds from "@/app/app/components/tabs/discover/RandomMinds";
import RandomMindsSkeleton from "@/app/app/components/tabs/discover/skeleton/randomMindsSkeleton";
import { UUID } from "crypto";

const Discover = async ({ userId }: { userId: UUID }) => {
  return (
    <div className="mx-auto flex flex-col gap-8 md:gap-16 lg:justify-between">
      <div className="relative w-full">
        <Suspense fallback={<StatisticsSkeleton />}>
          <Statistics userId={userId} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-16">
        <Suspense fallback={<PersonalizedSkeleton />}>
          <Personalized userId={userId} />
        </Suspense>

        <Suspense fallback={<PopularMindsSkeleton />}>
          <PopularMinds userId={userId} />
        </Suspense>

        <Suspense fallback={<PopularSkeleton />}>
          <Popular />
        </Suspense>

        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories userId={userId} />
        </Suspense>

        <Suspense fallback={<RandomMindsSkeleton />}>
          <RandomMinds userId={userId} />
        </Suspense>

        <Suspense fallback={<SavedSummariesSkeleton />}>
          <SavedSummaries userId={userId} />
        </Suspense>
      </div>
    </div>
  );
};

export default Discover;
