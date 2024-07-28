import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import React from "react";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { getUserTopics } from "@/actions/topics";
import TopicIcon from "@/components/global/TopicIcon";
import { Skeleton } from "@/components/ui/skeleton";

export const TopicsListSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {[...Array(12)].map((_, index) => (
        <div key={index}>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
};

const TopicsList = async ({ profileId, userId }: { profileId: UUID; userId: UUID }) => {
  const topics = await getUserTopics(profileId);
  const myTopics = await getUserTopics(userId);

  const sortedTopics = [...topics]?.sort((a, b) => a?.name.localeCompare(b?.name));

  if (sortedTopics?.length === 0)
    return (
      <div className="flex h-32 flex-col items-center justify-center gap-4 text-center">
        <TypographyH3AsSpan>Aucun sujet</TypographyH3AsSpan>
      </div>
    );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {sortedTopics?.map((topic) => (
        <div key={topic?.id}>
          <Button variant={myTopics?.find((t) => t.id === topic?.id) ? "default" : "outline"}>
            <TopicIcon topic={topic} isChecked={myTopics?.some((t) => t.id === topic?.id)} />
            {topic.name}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TopicsList;
