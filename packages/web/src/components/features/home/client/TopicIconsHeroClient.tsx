"use client";
import "client-only";

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import type { Tables } from "@/types/supabase";

const TopicIconsHeroClient = ({ topic }: { topic: Tables<"topics"> }) => {
  const { resolvedTheme } = useTheme();

  const icon = resolvedTheme === "dark" ? topic.white_icon : topic.black_icon;

  return (
    <span className="relative mr-2 h-3 w-3 flex-shrink-0 overflow-hidden">
      <Image src={icon as string} alt={topic.name} fill={true} className="object-cover" />
    </span>
  );
};

export default TopicIconsHeroClient;
