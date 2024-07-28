import React from "react";
import BookCover from "@/components/global/BookCover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import TypographyH3 from "@/components/typography/h3";
import TypographyP from "@/components/typography/p";
import type { UUID } from "crypto";
import { getUserSummariesFromLibrary } from "@/actions/users";
import Link from "next/link";

const SavedSummaries = async ({ userId }: { userId: UUID }) => {
  const savedSummaries = await getUserSummariesFromLibrary(userId);

  return (
    <>
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
              <TypographyH3>Votre librairie</TypographyH3>
              <TypographyP muted>Retrouvez les résumés que vous avez sauvegardés.</TypographyP>
            </div>

            <CarouselContent className="-ml-4">
              {savedSummaries?.map((summary) => {
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
    </>
  );
};

export default SavedSummaries;
