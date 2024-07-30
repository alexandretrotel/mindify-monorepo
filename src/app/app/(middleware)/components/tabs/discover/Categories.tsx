import React from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import TopicIcon from "@/components/global/TopicIcon";
import TypographyH3 from "@/components/typography/h3";
import TypographyH5AsSpan from "@/components/typography/h5AsSpan";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import TypographySpan from "@/components/typography/span";
import type { Tables } from "@/types/supabase";

const Categories = async ({ userId }: { userId: UUID }) => {
  const supabase = createClient();

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
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <TypographyH3>Vos intérêts</TypographyH3>
          <TypographySpan muted>
            {sortedUserTopics?.length > 0
              ? "Explorez des résumés extraits de vos sujets préférés."
              : "Explorez des résumés en fonction de certains sujets."}
          </TypographySpan>
        </div>

        <CarouselContent className="-ml-4">
          {(sortedUserTopics?.length >= 3 ? sortedUserTopics : sortedTopics)
            ?.reduce((acc, topic, index) => {
              if (index % 3 === 0) {
                acc.push([]);
              }
              acc[acc.length - 1].push(topic as Tables<"topics">);
              return acc;
            }, [] as Tables<"topics">[][])
            .map((topics, index) => (
              <CarouselItem key={index} className="flex gap-4">
                {topics.map((topic) => (
                  <Link key={topic.id} href={`/topics/${topic.slug}`}>
                    <Button variant="ghost" className="flex flex-col items-center gap-2" size="sm">
                      <TopicIcon
                        topic={topic}
                        isChecked={sortedUserTopics?.some(
                          (userTopic) => userTopic?.id === topic.id
                        )}
                      />
                      <TypographyH5AsSpan>{topic.name}</TypographyH5AsSpan>
                    </Button>
                  </Link>
                ))}
              </CarouselItem>
            ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
};

export default Categories;
