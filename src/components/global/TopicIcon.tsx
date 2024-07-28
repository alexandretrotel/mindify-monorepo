"use client";
import "client-only";

import React from "react";
import Image from "next/image";
import { setIconColorFromTheme } from "@/utils/theme";
import { useTheme } from "next-themes";
import type { Topic } from "@/types/topics";

const TopicIcon = ({ topic, isChecked }: { topic: Topic; isChecked: boolean }) => {
  const { resolvedTheme } = useTheme();

  return (
    <span className="relative mr-2 h-3 w-3 flex-shrink-0 overflow-hidden">
      <Image
        src={
          isChecked
            ? setIconColorFromTheme(resolvedTheme as string, topic, true)
            : setIconColorFromTheme(resolvedTheme as string, topic, false)
        }
        alt={topic?.name}
        fill={true}
        className="object-cover"
      />
    </span>
  );
};

export default TopicIcon;
