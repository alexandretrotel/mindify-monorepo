"use client";
import "client-only";

import React from "react";
import Image from "next/image";
import type { Topic } from "@/types/topics/topics";
import { useTheme } from "next-themes";

const TopicIconHero = ({ topic }: { topic: Topic }) => {
  const { theme } = useTheme();

  const icon = theme === "dark" ? topic.white_icon : topic.black_icon;

  return (
    <span className="relative mr-2 h-3 w-3 flex-shrink-0 overflow-hidden">
      <Image src={icon as string} alt={topic.name} fill={true} objectFit="cover" />
    </span>
  );
};

export default TopicIconHero;
