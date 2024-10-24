import React, { type JSX } from "react";
import H3Span from "@/components/typography/h3AsSpan";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/features/account/Navigation";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";

export default function Account({
  userId,
  userMetadata,
  category,
  setCategory,
  topics,
  userTopics,
  userPicture,
  tabs
}: Readonly<{
  userId: UUID;
  userMetadata: UserMetadata;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
  userPicture: string;
  tabs: {
    key: string;
    label: string;
    icon: JSX.Element;
    disabled: boolean;
  }[];
}>) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <H3Span>Mon compte</H3Span>
        <Muted>Gérez les paramètres de votre compte et définissez vos préférences.</Muted>
      </div>

      <Separator />

      <Navigation
        userId={userId}
        userMetadata={userMetadata}
        category={category}
        setCategory={setCategory}
        topics={topics}
        userTopics={userTopics}
        userPicture={userPicture}
        tabs={tabs}
      />
    </div>
  );
}
