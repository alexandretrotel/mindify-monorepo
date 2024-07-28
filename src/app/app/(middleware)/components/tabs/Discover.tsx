import React, { Suspense } from "react";
import Statistics from "@/app/app/(middleware)/components/Statistics";
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

const Discover = ({ userId }: { userId: UUID }) => {
  return (
    <div className="mx-auto flex flex-col gap-8 md:gap-16 lg:flex-row lg:justify-between">
      <div className="order-2 flex flex-col gap-16 lg:order-1 lg:min-w-0 lg:grow">
        <Suspense fallback={<PersonalizedSkeleton />}>
          <Personalized userId={userId} />
        </Suspense>

        <Suspense fallback={<CategoriesSkeleton />}>
          <Categories userId={userId} />
        </Suspense>

        <Suspense fallback={<PopularSkeleton />}>
          <Popular />
        </Suspense>

        <Suspense fallback={<SavedSummariesSkeleton />}>
          <SavedSummaries userId={userId} />
        </Suspense>
      </div>

      <div className="relative order-1 w-full lg:order-2 lg:max-w-xs">
        <div className="w-full lg:sticky lg:right-0 lg:top-0 lg:pt-8">
          <Suspense fallback={<StatisticsSkeleton userId={userId} />}>
            <Statistics userId={userId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Discover;
