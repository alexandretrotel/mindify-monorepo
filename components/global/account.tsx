import React from "react";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/app/app/(middleware)/components/account/navigation";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountCategory } from "@/types/account/categories";
import type { UserMetadata } from "@supabase/supabase-js";
import type { Topics } from "@/types/topics/topics";
import { UUID } from "crypto";

export default function Account({
  userId,
  userMetadata,
  showMenu,
  setShowMenu,
  category,
  setCategory,
  topics,
  userTopics
}: Readonly<{
  userId: UUID;
  userMetadata: UserMetadata;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  category: AccountCategory;
  setCategory: React.Dispatch<React.SetStateAction<AccountCategory>>;
  topics: Topics;
  userTopics: Topics;
}>) {
  if (!showMenu) return null;

  return (
    <div className="hide-scrollbar fixed left-0 top-0 z-50 mx-auto flex h-full w-full items-start justify-center overflow-y-auto bg-background">
      <div className="flex w-full flex-col justify-center gap-8 px-4 py-12 md:max-w-7xl md:p-8">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col">
            <TypographyH3AsSpan>Mon compte</TypographyH3AsSpan>
            <TypographyP muted>
              Gérez les paramètres de votre compte et définissez vos préférences.
            </TypographyP>
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
        />
      </div>
    </div>
  );
}
