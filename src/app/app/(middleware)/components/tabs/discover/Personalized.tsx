import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import BookCover from "@/components/global/BookCover";
import Link from "next/link";
import TypographyH3 from "@/components/typography/h3";
import { createClient } from "@/utils/supabase/server";
import { getUserPersonalizedSummariesFromInterests } from "@/actions/users";
import type { UUID } from "crypto";
import TypographySpan from "@/components/typography/span";

const Personalized = async ({ userId }: { userId: UUID }) => {
  const supabase = createClient();

  const summariesMatchingUserTopics = await getUserPersonalizedSummariesFromInterests(userId);

  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*, authors(name, slug), topics(name)")
    .limit(15);

  const summaries = summariesData?.map((summary) => {
    return {
      ...summary,
      topic: summary.topics?.name as string,
      author_slug: summary.authors?.slug as string
    };
  });

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
          <TypographyH3>Pour vous</TypographyH3>
          <TypographySpan muted>Découvrez des résumés adaptés à vos intérêts.</TypographySpan>
        </div>

        <CarouselContent className="-ml-4">
          {(summariesMatchingUserTopics?.length >= 3 ? summariesMatchingUserTopics : summaries)
            ?.slice(0, 15)
            ?.map((summary) => {
              return (
                <CarouselItem key={summary.id} className="basis-1/2 pl-4 lg:basis-1/3">
                  <Link
                    href={`/app/summary/${summary.author_slug}/${summary.slug}`}
                    className="h-full"
                  >
                    <BookCover
                      title={summary?.title}
                      author={summary?.authors?.name as string}
                      category={summary?.topic}
                      source={summary?.source_type}
                      image={summary?.image_url ?? undefined}
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

export default Personalized;
