"use client";
import "client-only";

import { Button } from "@/components/ui/button";
import type { Topics } from "@/types/topics/topics";
import { UUID } from "crypto";
import React from "react";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { getUserTopics } from "@/actions/topics";
import Image from "next/image";
import { useTheme } from "next-themes";

const TopicsList = ({ profileId }: { profileId: UUID }) => {
  const [topics, setTopics] = React.useState<Topics>([]);

  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const fetchTopics = async () => {
      const topics = await getUserTopics(profileId);
      setTopics(topics);
    };

    fetchTopics();
  }, [profileId]);

  if (!topics || topics?.length === 0)
    return (
      <div className="flex h-32 flex-col items-center justify-center gap-4 text-center">
        <TypographyH3AsSpan>Aucun sujet</TypographyH3AsSpan>
      </div>
    );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {topics?.map((topic) => (
        <div key={topic?.id}>
          <Button variant="outline">
            <span className="relative mr-2 h-3 w-3 flex-shrink-0 overflow-hidden">
              <Image
                src={
                  resolvedTheme === "dark"
                    ? (topic?.white_icon as string)
                    : (topic?.black_icon as string)
                }
                alt={topic?.name}
                fill={true}
                className="object-cover"
              />
            </span>
            {topic.name}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TopicsList;
