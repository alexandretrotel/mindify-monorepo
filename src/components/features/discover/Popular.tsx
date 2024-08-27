import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import BookCover from "@/components/global/BookCover";
import H3 from "@/components/typography/h3";
import { getMostPopularSummaries } from "@/actions/summaries";
import { Muted } from "@/components/typography/muted";

const Popular = async () => {
  const popularSummaries = await getMostPopularSummaries();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Les + populaires</H3>
        <Muted>Explorez les résumés les plus lus.</Muted>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {popularSummaries?.slice(0, 15)?.map((summary) => {
            return (
              <CarouselItem key={summary.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
                <BookCover
                  title={summary.title}
                  author={summary.authors.name}
                  category={summary.topic}
                  source={summary.source_type}
                  image={summary.image_url ?? undefined}
                  authorSlug={summary.authors.slug}
                  summarySlug={summary.slug}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default Popular;
