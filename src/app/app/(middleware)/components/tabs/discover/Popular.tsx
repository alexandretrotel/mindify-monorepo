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
import H3 from "@/components/typography/h3";
import { getMostPopularSummaries } from "@/actions/summaries";
import { Muted } from "@/components/typography/muted";

const Popular = async () => {
  const popularSummaries = await getMostPopularSummaries();

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
          <H3>Les + populaires</H3>
          <Muted>Explorez les résumés les plus lus.</Muted>
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
                    author={summary.authors.name}
                    category={summary.topic}
                    source={summary.source_type}
                    image={summary.image_url ?? undefined}
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
