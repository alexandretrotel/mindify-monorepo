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
import { getUserSummariesFromLibrary } from "@/actions/users";
import Link from "next/link";
import { Muted } from "@/components/typography/muted";

const SavedSummaries = async ({ userId }: { userId: UUID }) => {
  const savedSummaries = await getUserSummariesFromLibrary(userId);

  return (
    <React.Fragment>
      {savedSummaries?.length >= 3 && (
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: "auto"
          }}
          className="w-full"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <H3>Votre librairie</H3>
              <Muted>Retrouvez les résumés que vous avez sauvegardés.</Muted>
            </div>

            <CarouselContent className="-ml-4">
              {savedSummaries?.map((summary) => {
                return (
                  <CarouselItem key={summary.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
                    <Link
                      href={`/summary/${summary.author_slug}/${summary.slug}`}
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
      )}
    </React.Fragment>
  );
};

export default SavedSummaries;
