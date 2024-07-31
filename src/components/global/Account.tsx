import React from "react";
import H3Span from "@/components/typography/h3AsSpan";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/app/app/(middleware)/components/account/Navigation";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountCategory } from "@/types/account";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";

export default function Account({
  userId,
  userMetadata,
  showMenu,
  setShowMenu,
  category,
  setCategory,
  topics,
  userTopics,
  userPicture
}: Readonly<{
  userId: UUID;
  userMetadata: UserMetadata;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  category: AccountCategory;
  setCategory: React.Dispatch<React.SetStateAction<AccountCategory>>;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
  userPicture: string;
}>) {
  if (!showMenu) return null;

  return (
    <div className="hide-scrollbar fixed left-0 top-0 z-50 mx-auto flex h-full w-full items-start justify-center overflow-y-auto bg-background">
      <div className="flex w-full flex-col justify-center gap-8 px-4 py-12 md:max-w-7xl md:p-8">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col">
            <H3Span>Mon compte</H3Span>
            <Muted>Gérez les paramètres de votre compte et définissez vos préférences.</Muted>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowMenu(false)} variant="ghost" size="sm">
              <XIcon className="h-6 w-6" />
            </Button>
          </div>
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
    </div>
  );
}
