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

const Discover = async () => {
  return (
    <div className="mx-auto flex flex-col gap-8 md:gap-16 lg:justify-between">
      <div className="relative w-full">
        <Suspense fallback={<StatisticsSkeleton />}>
          <Statistics />
        </Suspense>
      </div>

      <div className="flex flex-col gap-16">
        <Suspense fallback={<PersonalizedSkeleton />}>
          <Personalized />
        </Suspense>

        <Suspense fallback={<PopularMindsSkeleton />}>
          <PopularMinds />
        </Suspense>

        <Suspense fallback={<PopularSkeleton />}>
          <Popular />
        </Suspense>

        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories />
        </Suspense>

        <Suspense fallback={<RandomMindsSkeleton />}>
          <RandomMinds />
        </Suspense>

        <Suspense fallback={<SavedSummariesSkeleton />}>
          <SavedSummaries />
        </Suspense>
      </div>
    </div>
  );
};

export default Discover;
