import React from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import TopicIcon from "@/components/global/TopicIcon";
import H3 from "@/components/typography/h3";
import H5Span from "@/components/typography/h5AsSpan";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";

const Categories = async () => {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id as UUID;

  const { data: userTopicsData } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", userId);
  const userTopics = userTopicsData?.flatMap((data) => data.topics);

  const { data: topicsData } = await supabase.from("topics").select("*");

  const sortedUserTopics = userTopics
    ? [...userTopics]?.sort((a, b) => a?.name.localeCompare(b?.name as string) as number)
    : [];
  const sortedTopics = topicsData
    ? [...topicsData]?.sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <React.Fragment>
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full lg:hidden"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <H3>Vos intérêts</H3>
            <Muted size="md">
              {sortedUserTopics?.length > 0
                ? "Explorez des résumés extraits de vos sujets préférés."
                : "Explorez des résumés en fonction de certains sujets."}
            </Muted>
          </div>

          <CarouselContent className="-ml-4">
            {(sortedUserTopics?.length >= 3 ? sortedUserTopics : sortedTopics)
              ?.reduce((acc, topic, index) => {
                const chunkIndex = Math.floor(index / 4);

                if (!acc[chunkIndex]) {
                  acc[chunkIndex] = [];
                }

                acc[chunkIndex].push(topic as Tables<"topics">);
                return acc;
              }, [] as Tables<"topics">[][])
              .map((topicChunk, index) => (
                <CarouselItem key={index} className="pl-4">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {topicChunk.map((topic) => (
                      <Button asChild key={topic.id} className="col-span-1">
                        <Link href={`/app/topic/${topic.slug}`} className="w-full">
                          <TopicIcon isChecked={true} topic={topic} />
                          <H5Span>{topic.name}</H5Span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
        </div>
      </Carousel>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="hidden w-full lg:block"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <H3>Vos intérêts</H3>
            <Muted size="md">
              {sortedUserTopics?.length > 0
                ? "Explorez des résumés extraits de vos sujets préférés."
                : "Explorez des résumés en fonction de certains sujets."}
            </Muted>
          </div>

          <CarouselContent className="-ml-4">
            {(sortedUserTopics?.length >= 3 ? sortedUserTopics : sortedTopics)
              ?.reduce((acc, topic, index) => {
                const chunkIndex = Math.floor(index / 8);

                if (!acc[chunkIndex]) {
                  acc[chunkIndex] = [];
                }

                acc[chunkIndex].push(topic as Tables<"topics">);
                return acc;
              }, [] as Tables<"topics">[][])
              .map((topicChunk, index) => (
                <CarouselItem key={index} className="pl-4">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {topicChunk.map((topic) => (
                      <Button asChild key={topic.id} className="col-span-1">
                        <Link href={`/app/topic/${topic.slug}`} className="w-full">
                          <TopicIcon isChecked={true} topic={topic} />
                          <H5Span>{topic.name}</H5Span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
        </div>
      </Carousel>
    </React.Fragment>
  );
};

export default Categories;
