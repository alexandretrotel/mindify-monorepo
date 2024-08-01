import React, { Suspense } from "react";
import Statistics from "@/app/app/(middleware)/components/tabs/discover/Statistics";
import Categories from "@/app/app/(middleware)/components/tabs/discover/Categories";
import Personalized from "@/app/app/(middleware)/components/tabs/discover/Personalized";
import Popular from "@/app/app/(middleware)/components/tabs/discover/Popular";
import SavedSummaries from "@/app/app/(middleware)/components/tabs/discover/SavedSummaries";
import type { UUID } from "crypto";
import CategoriesSkeleton from "@/app/app/(middleware)/components/tabs/discover/skeleton/CategoriesSkeleton";
import PersonalizedSkeleton from "@/app/app/(middleware)/components/tabs/discover/skeleton/PersonalizedSkeleton";
import PopularSkeleton from "@/app/app/(middleware)/components/tabs/discover/skeleton/PopularSkeleton";
import SavedSummariesSkeleton from "@/app/app/(middleware)/components/tabs/discover/skeleton/SavedSummariesSkeleton";
import StatisticsSkeleton from "@/app/app/(middleware)/components/skeleton/StatisticsSkeleton";
import PopularMinds from "@/app/app/(middleware)/components/tabs/discover/PopularMinds";
import PopularMindsSkeleton from "@/app/app/(middleware)/components/tabs/discover/skeleton/PopularMindsSkeleton";

const Discover = ({ userId }: { userId: UUID }) => {
  return (
    <div className="mx-auto flex flex-col gap-8 md:gap-16 lg:justify-between">
      <div className="relative w-full">
        <Suspense fallback={<StatisticsSkeleton userId={userId} />}>
          <Statistics userId={userId} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-16">
        <Suspense fallback={<PersonalizedSkeleton />}>
          <Personalized userId={userId} />
        </Suspense>

        <Suspense fallback={<PopularMindsSkeleton />}>
          <PopularMinds />
        </Suspense>

        <Suspense fallback={<PopularSkeleton />}>
          <Popular />
        </Suspense>

        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories userId={userId} />
        </Suspense>

        <Suspense fallback={<SavedSummariesSkeleton />}>
          <SavedSummaries userId={userId} />
        </Suspense>
      </div>
    </div>
  );
};

export default Discover;
