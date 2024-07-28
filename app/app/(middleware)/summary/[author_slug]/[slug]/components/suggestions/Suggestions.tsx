import React from "react";
import Link from "next/link";
import { getMostPopularSummariesFromSameTopic } from "@/actions/summaries";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import BookCover from "@/components/global/bookCover";
import type { Summary } from "@/types/summary/summary";
import TypographyH2 from "@/components/typography/h2";
import type { UUID } from "crypto";

const Suggestions = async ({
  topicId,
  summary,
  userId
}: {
  topicId: number;
  summary: Summary;
  userId: UUID;
}) => {
  const mostPopularSummariesFromSameTopic = await getMostPopularSummariesFromSameTopic(
    topicId,
    summary,
    userId,
    4
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
            <TypographyH2>À découvrir aussi...</TypographyH2>
            <CarouselContent className="-ml-4">
              {mostPopularSummariesFromSameTopic?.slice(0, 4)?.map((summary: Summary) => (
                <CarouselItem
                  key={summary?.id}
                  className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
                >
                  <Link
                    key={summary?.id}
                    href={`/app/summary/${summary?.author_slug}/${summary?.slug}`}
                    className="h-full"
                  >
                    <BookCover
                      title={summary?.title}
                      author={summary?.author}
                      category={summary?.topic}
                      source={summary?.source_type}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
      )}
    </>
  );
};

export default Suggestions;
