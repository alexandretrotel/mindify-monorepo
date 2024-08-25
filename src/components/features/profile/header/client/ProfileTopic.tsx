"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import TopicIconsHero from "@/components/features/home/hero/client/TopicIconsHero";

const ProfileTopic = ({ topic }: { topic: Tables<"topics"> }) => {
  const { resolvedTheme } = useTheme();

  const icon = resolvedTheme === "dark" ? topic.white_icon : topic.black_icon;

  return (
    <Button size="sm" variant="outline">
      <TopicIconsHero topic={topic} />
      {topic.name}
    </Button>
  );
};

export default ProfileTopic;
