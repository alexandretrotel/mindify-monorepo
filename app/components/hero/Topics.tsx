import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import TopicIconsHero from "@/app/components/hero/TopicIconsHero";
import type { Topics } from "@/types/topics/topics";

const Topics = async () => {
  const supabase = createClient();

  const { data: topicsData } = await supabase.from("topics").select("*");
  const topics = topicsData as Topics;

  const sortedTopics = [...topics]?.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto mt-10 flex max-w-lg flex-wrap justify-center gap-2 sm:mt-20">
      {sortedTopics?.map((topic) => (
        <Button key={topic.id} variant={"outline"}>
          <TopicIconsHero topic={topic} />
          {topic.name}
        </Button>
      ))}
    </div>
  );
};

export default Topics;
