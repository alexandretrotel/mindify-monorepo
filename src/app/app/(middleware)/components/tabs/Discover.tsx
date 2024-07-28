import React from "react";
import Statistics from "@/app/app/(middleware)/components/Statistics";
import Categories from "@/app/app/(middleware)/components/tabs/discover/Categories";
import Personalized from "@/app/app/(middleware)/components/tabs/discover/Personalized";
import Popular from "@/app/app/(middleware)/components/tabs/discover/Popular";
import SavedSummaries from "@/app/app/(middleware)/components/tabs/discover/SavedSummaries";

const Discover = () => {
  return (
    <div className="mx-auto flex flex-col gap-8 md:gap-16 lg:flex-row lg:justify-between">
      <div className="order-2 flex flex-col gap-16 lg:order-1 lg:min-w-0 lg:grow">
        <Personalized />
        <Categories />
        <Popular />
        <SavedSummaries />
      </div>

      <div className="relative order-1 w-full lg:order-2 lg:max-w-xs">
        <div className="w-full lg:sticky lg:right-0 lg:top-0 lg:pt-8">
          <Statistics />
        </div>
      </div>
    </div>
  );
};

export default Discover;
