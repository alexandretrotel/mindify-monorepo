import React from "react";
import H3Span from "@/components/typography/h3AsSpan";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/features/account/Navigation";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountCategory } from "@/types/account";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";
import { Tab } from "@/app/app/my-account/page";

export default function Account({
  userId,
  userMetadata,
  category,
  setCategory,
  topics,
  userTopics,
  userPicture,
  initialTab
}: Readonly<{
  userId: UUID;
  userMetadata: UserMetadata;
  category: AccountCategory;
  setCategory: React.Dispatch<React.SetStateAction<AccountCategory>>;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
  userPicture: string;
  initialTab?: Tab;
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
      />
    </div>
  );
}
