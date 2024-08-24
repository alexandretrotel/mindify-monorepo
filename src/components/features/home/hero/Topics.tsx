import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import TopicIconsHero from "@/components/features/home/hero/client/TopicIconsHero";
import Link from "next/link";

const Topics = async () => {
  const supabase = createClient();

  const { data: topicsData } = await supabase.from("topics").select("*");

  const sortedTopics = topicsData
    ? [...topicsData]?.sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <div className="mx-auto mt-10 flex max-w-lg flex-wrap justify-center gap-2 sm:mt-20">
      {sortedTopics?.map((topic) => (
        <Button key={topic.id} variant={"outline"} asChild>
          <Link href={`/topic/${topic.slug}`}>
            <TopicIconsHero topic={topic} />
            {topic.name}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default Topics;
