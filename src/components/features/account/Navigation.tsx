import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { BellRingIcon, CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountCategories from "@/components/features/account/Categories";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import type { Tables } from "@/types/supabase";

export default function Navigation({
  userId,
  userMetadata,
  category,
  setCategory,
  topics,
  userTopics,
  userPicture,
  tabs,
  userEmail
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
  userEmail: string;
}>) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-4">
      <div className="hide-scrollbar h-full w-full overflow-x-auto md:w-1/5">
        <NavigationMenu className="w-full min-w-full justify-start">
          <NavigationMenuList className="flex w-full gap-2 space-x-0 md:flex-col">
            {tabs.map((tab) => (
              <NavigationMenuItem key={tab.key} className="w-full">
                <Button
                  onClick={() => setCategory(tab.key)}
                  variant={category === tab.key ? "default" : "ghost"}
                  className="flex w-full items-center justify-start gap-2"
                  size="sm"
                  disabled={tab.disabled}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="w-full">
        <AccountCategories
          userId={userId}
          userMetadata={userMetadata}
          category={category}
          topics={topics}
          userTopics={userTopics}
          userPicture={userPicture}
          userEmail={userEmail}
        />
      </div>
    </div>
  );
}
