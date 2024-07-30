import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import BookCover from "@/components/global/BookCover";
import Link from "next/link";
import TypographyH3 from "@/components/typography/h3";
import TypographySpan from "@/components/typography/span";
import { getMostPopularSummaries } from "@/actions/summaries";
import type { Summaries } from "@/types/summary";

const Popular = async () => {
  const popularSummaries: Summaries = await getMostPopularSummaries();

  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <TypographyH3>Les + populaires</TypographyH3>
          <TypographySpan muted>Explorez les résumés les plus lus.</TypographySpan>
        </div>

        <CarouselContent className="-ml-4">
          {popularSummaries?.slice(0, 15)?.map((summary) => {
            return (
              <CarouselItem key={summary.id} className="basis-1/2 pl-4 lg:basis-1/3">
                <Link
                  href={`/app/summary/${summary.author_slug}/${summary.slug}`}
                  className="h-full"
                >
                  <BookCover
                    title={summary.title}
                    author={summary.author}
                    category={summary.topic}
                    source={summary.source_type}
                    image={summary.image_url}
                  />
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  );
};

export default Popular;
