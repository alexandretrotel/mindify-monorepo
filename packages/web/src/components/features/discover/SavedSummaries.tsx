import React from "react";
import BookCover from "@/components/global/BookCover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import H3 from "@/components/typography/h3";
import type { UUID } from "crypto";
import { getUserSummariesFromLibrary } from "@/actions/users.action";
import { Muted } from "@/components/typography/muted";

const SavedSummaries = async ({ userId }: { userId: UUID }) => {
  const savedSummaries = await getUserSummariesFromLibrary(userId);

  if (!savedSummaries || savedSummaries?.length < 3) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Votre librairie</H3>
        <Muted>Retrouvez les résumés que vous avez sauvegardés.</Muted>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 flex">
          {savedSummaries?.map((summary) => {
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
                  heightFull
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

export default SavedSummaries;
