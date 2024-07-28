import React from "react";
import { Topic, Topics } from "@/types/topics";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import TopicIcon from "@/components/global/TopicIcon";
import TypographyH3 from "@/components/typography/h3";
import TypographyH5AsSpan from "@/components/typography/h5AsSpan";
import TypographyP from "@/components/typography/p";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { UUID } from "crypto";

const Categories = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/app/login");
  }

  const userId = data?.user?.id as UUID;

  const { data: userTopicsData } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", userId);
  const userTopics = userTopicsData?.flatMap((data) => data.topics) as Topics;

  const { data: topicsData } = await supabase.from("topics").select("*");
  const topics = topicsData as Topics;

  const sortedUserTopics = [...userTopics]?.sort((a, b) => a.name.localeCompare(b.name));
  const sortedTopics = [...topics]?.sort((a, b) => a.name.localeCompare(b.name));

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
          <TypographyP muted>
            {sortedUserTopics?.length > 0
              ? "Explorez des résumés extraits de vos sujets préférés."
              : "Explorez des résumés en fonction de certains sujets."}
          </TypographyP>
        </div>

        <CarouselContent className="-ml-4">
          {(sortedUserTopics?.length >= 3 ? sortedUserTopics : sortedTopics)
            ?.reduce((acc: Topic[][], topic: Topic, index: number) => {
              const chunkIndex = Math.floor(index / 6);
              if (!acc[chunkIndex]) {
                acc[chunkIndex] = [];
              }
              acc[chunkIndex].push(topic);
              return acc;
            }, [])
            ?.map((topicChunk, index) => (
              <CarouselItem key={index} className="pl-4">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {topicChunk.map((topic: Topic) => (
                    <Button asChild key={topic.id} className="col-span-1">
                      <Link href={`/app/topic/${topic.slug}`} className="w-full">
                        <TopicIcon isChecked={true} topic={topic} />
                        <TypographyH5AsSpan>{topic.name}</TypographyH5AsSpan>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
};

export default Categories;
