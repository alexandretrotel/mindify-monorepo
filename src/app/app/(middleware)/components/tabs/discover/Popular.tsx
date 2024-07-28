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
import TypographyP from "@/components/typography/p";
import { createClient } from "@/utils/supabase/server";
import type { Summaries } from "@/types/summary";

const Popular = async () => {
  const supabase = createClient();

  const { data: popularSummariesData } = await supabase
    .from("user_reads")
    .select("summaries(*)")
    .order("count", { ascending: false })
    .limit(15);
  const popularSummaries = popularSummariesData?.flatMap((data) => data.summaries) as Summaries;

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
          <TypographyP muted>Explorez les résumés les plus lus.</TypographyP>
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
