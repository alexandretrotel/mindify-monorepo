import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import BookCover from "@/components/global/BookCover";
import H3 from "@/components/typography/h3";
import { createClient } from "@/utils/supabase/server";
import { getUserPersonalizedSummariesFromInterests } from "@/actions/users.action";
import type { UUID } from "crypto";
import { Muted } from "@/components/typography/muted";

const Personalized = async ({ userId }: { userId: UUID }) => {
  const supabase = await createClient();

  const summariesMatchingUserTopics = await getUserPersonalizedSummariesFromInterests(userId);

  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*, authors(*), topics(*)")
    .eq("production", true)
    .limit(15);

  const summaries = summariesData?.map((summary) => {
    return {
      ...summary,
      topic: summary.topics?.name as string,
      author_slug: summary.authors?.slug as string
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Pour vous</H3>
        <Muted>Découvrez des résumés adaptés à vos intérêts.</Muted>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 flex">
          {(summariesMatchingUserTopics?.length >= 3 ? summariesMatchingUserTopics : summaries)
            ?.slice(0, 15)
            ?.map((summary) => {
              return (
                <CarouselItem key={summary.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
                  <BookCover
                    title={summary?.title}
                    author={summary?.authors?.name as string}
                    category={summary?.topic}
                    source={summary?.source_type}
                    image={summary?.image_url ?? undefined}
                    authorSlug={summary?.authors?.slug as string}
                    summarySlug={summary?.slug}
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

export default Personalized;
