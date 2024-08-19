import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import React from "react";
import H3Span from "@/components/typography/h3AsSpan";
import { getUserTopics } from "@/actions/users";
import TopicIcon from "@/components/global/TopicIcon";
import Link from "next/link";

const TopicsList = async ({ profileId, userId }: { profileId: UUID; userId: UUID }) => {
  const topics = await getUserTopics(profileId);
  const myTopics = await getUserTopics(userId);

  const sortedTopics = topics ? [...topics]?.sort((a, b) => a?.name.localeCompare(b?.name)) : [];

  if (sortedTopics?.length === 0)
    return (
      <div className="flex h-32 flex-col items-center justify-center gap-4 text-center">
        <H3Span>Aucun sujet</H3Span>
      </div>
    );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {sortedTopics?.map((topic) => (
        <div key={topic?.id}>
          <Button
            variant={myTopics?.find((t) => t.id === topic?.id) ? "default" : "outline"}
            asChild
          >
            <Link href={`/app/topic/${topic?.slug}`}>
              <TopicIcon topic={topic} isChecked={myTopics?.some((t) => t.id === topic?.id)} />
              {topic.name}
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TopicsList;
