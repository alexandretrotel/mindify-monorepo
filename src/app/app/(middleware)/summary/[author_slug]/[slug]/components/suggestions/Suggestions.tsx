import React from "react";
import Link from "next/link";
import { getMostPopularSummariesFromSameTopic } from "@/actions/summaries";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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

  return (
    <>
      {mostPopularSummariesFromSameTopic?.length > 0 && (
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: "auto"
          }}
          className="w-full"
        >
          <div className="flex flex-col gap-4">
            <H2>À découvrir aussi...</H2>
            <CarouselContent className="-ml-4">
              {mostPopularSummariesFromSameTopic?.slice(0, 4)?.map(
                (
                  summary: Tables<"summaries"> & {
                    authors: Tables<"authors">;
                    topics: Tables<"topics">;
                  } & { author_slug: string; topic: string }
                ) => (
                  <CarouselItem
                    key={summary?.id}
                    className="pl-4 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link
                      key={summary?.id}
                      href={`/app/summary/${summary?.author_slug}/${summary?.slug}`}
                      className="h-full"
                    >
                      <BookCover
                        title={summary?.title}
                        author={summary?.authors?.name}
                        category={summary?.topics?.name}
                        source={summary?.source_type}
                        image={summary.image_url ?? undefined}
                      />
                    </Link>
                  </CarouselItem>
                )
              )}
            </CarouselContent>
          </div>
        </Carousel>
      )}
    </>
  );
};

export default Suggestions;
