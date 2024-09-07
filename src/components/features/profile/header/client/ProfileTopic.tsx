"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import TopicIconsHero from "@/components/features/home/client/TopicIconsHeroClient";

const ProfileTopic = ({ topic }: { topic: Tables<"topics"> }) => {
  return (
    <Button size="sm" variant="outline">
      <TopicIconsHero topic={topic} />
      {topic.name}
    </Button>
  );
};

export default ProfileTopic;
