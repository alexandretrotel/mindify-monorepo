import React from "react";
import Link from "next/link";
import { getMostPopularSummariesFromSameTopic } from "@/actions/summaries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import BookCover from "@/components/global/BookCover";
import H2 from "@/components/typography/h2";
import type { Tables } from "@/types/supabase";

const Suggestions = async ({
  topicId,
  summary
}: {
  topicId: number;
  summary: Tables<"summaries">;
}) => {
  const mostPopularSummariesFromSameTopic = await getMostPopularSummariesFromSameTopic(
    topicId,
    summary
  );

  if (!mostPopularSummariesFromSameTopic || mostPopularSummariesFromSameTopic.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <H2>À découvrir aussi...</H2>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {mostPopularSummariesFromSameTopic?.slice(0, 4)?.map(
            (
              summary: Tables<"summaries"> & {
                authors: Tables<"authors">;
                topics: Tables<"topics">;
              } & { author_slug: string; topic: string }
            ) => (
              <CarouselItem key={summary?.id} className="pl-4 md:basis-1/4 lg:basis-1/4">
                <BookCover
                  title={summary?.title}
                  author={summary?.authors?.name}
                  category={summary?.topics?.name}
                  source={summary?.source_type}
                  image={summary.image_url ?? undefined}
                  authorSlug={summary?.author_slug}
                  summarySlug={summary?.slug}
                />
              </CarouselItem>
            )
          )}
        </CarouselContent>

        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default Suggestions;
