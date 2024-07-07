import React from "react";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/application/account/navigation";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountCategory } from "@/types/account/categories";
import type { User } from "@supabase/supabase-js";

export default function Account({
  data,
  showMenu,
  setShowMenu,
  category,
  setCategory
}: {
  data: { user: User };
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  category: AccountCategory;
  setCategory: React.Dispatch<React.SetStateAction<AccountCategory>>;
}) {
  if (!showMenu) return null;

  return (
    <div className="hide-scrollbar fixed top-0 z-[1000] mx-auto flex h-full w-full items-start justify-center overflow-y-auto bg-background">
      <div className="flex w-full flex-col justify-center gap-8 px-4 py-12 md:max-w-7xl md:p-8">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col">
            <TypographyH3AsSpan>Mon compte</TypographyH3AsSpan>
            <TypographyP muted>
              Gérez les paramètres de votre compte et définissez vos préférences de notification.
            </TypographyP>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowMenu(false)} variant="ghost" size="sm">
              <XIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <Separator />
        <Navigation data={data} category={category} setCategory={setCategory} />
      </div>
    </div>
  );
}
