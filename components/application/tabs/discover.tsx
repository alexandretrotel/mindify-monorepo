import TypographyH3 from "@/components/typography/h3";
import TypographyH5AsSpan from "@/components/typography/h5AsSpan";
import TypographyP from "@/components/typography/p";
import { Card } from "@/components/ui/card";
import React from "react";
import Statistics from "@/components/application/tabs/discover/statistics";
import { Topics } from "@/types/topics/topics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setIconColorFromTheme } from "@/utils/theme/icon";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Book } from "lucide-react";
import BookCover from "@/components/global/bookCover";

const Discover = ({ topics }: { topics: Topics }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mx-auto grid w-full grid-cols-1 items-center justify-center gap-8 md:grid-cols-12">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-md lg:hidden">
        <Statistics />
      </div>

      <div className="flex w-full flex-col gap-16 md:col-span-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <TypographyH3>Pour vous</TypographyH3>
            <TypographyP muted>Découvrez des résumés de livres adaptés à vos intérêts.</TypographyP>
          </div>

          <div className="hide-scrollbar flex items-center gap-4 overflow-x-auto">
            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <Link key={index} href="/">
                  <BookCover title="L'art de la guerre" author="Sun Tzu" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <TypographyH3>Les catégories</TypographyH3>
            <TypographyP muted>Explorez des résumés de livres par catégories.</TypographyP>
          </div>

          <div className="hide-scrollbar flex items-center gap-4 overflow-x-auto">
            {topics?.map((topic) => {
              return (
                <Button key={topic.id} asChild>
                  <Link href={`/discover/${topic.slug}`}>
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
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <TypographyH3>Les plus populaires</TypographyH3>
            <TypographyP muted>Les résumés de livres les plus populaires.</TypographyP>
          </div>

          <div className="hide-scrollbar flex items-center gap-4 overflow-x-auto">
            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <Link key={index} href="/">
                  <BookCover title="L'art de la guerre" author="Sun Tzu" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="hidden h-full w-full max-w-xl flex-col gap-4 rounded-md md:col-span-4 lg:flex">
        <Statistics />
      </div>
    </div>
  );
};

export default Discover;
