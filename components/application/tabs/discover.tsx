import TypographyH3 from "@/components/typography/h3";
import TypographyH5AsSpan from "@/components/typography/h5AsSpan";
import TypographyP from "@/components/typography/p";
import React from "react";
import Statistics from "@/components/application/tabs/discover/statistics";
import type { Topic, Topics, UserTopics } from "@/types/topics/topics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setIconColorFromTheme } from "@/utils/theme/icon";
import Image from "next/image";
import { useTheme } from "next-themes";
import BookCover from "@/components/global/bookCover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const Discover = ({ topics, userTopics }: { topics: Topics; userTopics: UserTopics }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mx-auto flex max-w-full flex-col items-start gap-8 md:gap-16 lg:flex-row lg:justify-between">
      <div className="flex w-full flex-col gap-4 lg:hidden">
        <Statistics />
      </div>

      <div className="flex max-w-full flex-col gap-16 lg:min-w-0 lg:grow">
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
              {Array.from({ length: 20 })
                .slice(0, 15)
                .map((_, index) => {
                  return (
                    <CarouselItem key={index} className="basis-1/2 pl-4 lg:basis-1/3">
                      <Link href="/">
                        <BookCover
                          title="L'art de la guerre"
                          author="Sun Tzu"
                          category="Histoire"
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
              <TypographyP muted>Explorez des résumés extraits de vos sujets préférés.</TypographyP>
            </div>

            <CarouselContent className="-ml-4">
              {topics
                ?.filter((topic) =>
                  userTopics?.find((userTopic) => userTopic.topic_id === topic.id)
                )
                ?.sort((a, b) => a.name.localeCompare(b.name))
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
                          <Link href={`/topic/${topic.slug}`} className="w-full">
                            <span className="relative mr-2 h-3 w-3 flex-shrink-0 overflow-hidden">
                              <Image
                                src={setIconColorFromTheme(resolvedTheme as string, topic, true)}
                                alt={topic.name}
                                fill={true}
                                className="object-cover"
                              />
                            </span>
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
              {Array.from({ length: 20 })
                .slice(0, 15)
                .map((_, index) => {
                  return (
                    <CarouselItem key={index} className="basis-1/2 pl-4 lg:basis-1/3">
                      <Link href="/">
                        <BookCover
                          title="L'art de la guerre"
                          author="Sun Tzu"
                          category="Histoire"
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
      </div>

      <div className="hidden w-full max-w-xs flex-col gap-4 lg:flex">
        <Statistics />
      </div>
    </div>
  );
};

export default Discover;
