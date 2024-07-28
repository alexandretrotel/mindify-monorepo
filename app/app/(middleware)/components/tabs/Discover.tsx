import TypographyH3 from "@/components/typography/h3";
import TypographyH5AsSpan from "@/components/typography/h5AsSpan";
import TypographyP from "@/components/typography/p";
import React from "react";
import Statistics from "@/components/application/tabs/discover/Statistics";
import type { Topic, Topics } from "@/types/topics/topics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookCover from "@/components/global/BookCover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import type { Summaries } from "@/types/summary/summary";
import type { UserLibrary, UserReads } from "@/types/user";
import TopicIcon from "@/components/global/TopicIcon";

const Discover = ({
  topics,
  userTopics,
  summaries,
  userReads,
  userLibrary
}: {
  topics: Topics;
  userTopics: Topics;
  summaries: Summaries;
  userReads: UserReads;
  userLibrary: UserLibrary;
}) => {
  const sortedUserTopics = userTopics
    ? [...userTopics]?.sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const sortedTopics = topics ? [...topics]?.sort((a, b) => a.name.localeCompare(b.name)) : [];

  const summariesMatchingUserTopics = summaries?.filter((summary) =>
    userTopics?.some((userTopic) => userTopic.id === summary.topic_id)
  );
  const popularSummaries = [...summaries]?.sort(
    (a, b) => (b.number_of_reads as number) - (a.number_of_reads as number)
  );
  const savedSummaries = summaries?.filter((summary) =>
    userLibrary?.some((library) => library.summary_id === summary.id)
  );

  return (
    <div className="mx-auto flex flex-col gap-8 md:gap-16 lg:flex-row lg:justify-between">
      <div className="order-2 flex flex-col gap-16 lg:order-1 lg:min-w-0 lg:grow">
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
              <TypographyP muted>Découvrez des résumés adaptés à vos intérêts.</TypographyP>
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
      </div>

      <div className="relative order-1 w-full lg:order-2 lg:max-w-xs">
        <div className="w-full lg:sticky lg:right-0 lg:top-0 lg:pt-8">
          <Statistics userReads={userReads} summaries={summaries} />
        </div>
      </div>
    </div>
  );
};

export default Discover;
