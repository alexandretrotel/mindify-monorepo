import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { BellRingIcon, CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountCategory } from "@/types/account";
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
  userPicture
}: Readonly<{
  userId: UUID;
  userMetadata: UserMetadata;
  category: AccountCategory;
  setCategory: React.Dispatch<React.SetStateAction<AccountCategory>>;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
  userPicture: string;
}>) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-4">
      <div className="hide-scrollbar h-full w-full overflow-x-auto md:w-1/5">
        <NavigationMenu className="w-full min-w-full justify-start">
          <NavigationMenuList className="flex w-full gap-2 space-x-0 md:flex-col">
            <NavigationMenuItem className="w-full">
              <Button
                onClick={() => setCategory("profile")}
                variant={category === "profile" ? "default" : "ghost"}
                className="flex w-full items-center justify-start gap-2"
                size="sm"
              >
                <UserIcon className="h-4 w-4" />
                Profil
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <Button
                onClick={() => setCategory("subscription")}
                variant={category === "subscription" ? "default" : "ghost"}
                className="flex w-full items-center justify-start gap-2"
                size="sm"
                disabled
              >
                <CreditCardIcon className="h-4 w-4" />
                Abonnement
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <Button
                onClick={() => setCategory("notifications")}
                variant={category === "notifications" ? "default" : "ghost"}
                className="flex w-full items-center justify-start gap-2"
                size="sm"
                disabled
              >
                <BellRingIcon className="h-4 w-4" />
                Notifications
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <Button
                onClick={() => setCategory("settings")}
                variant={category === "settings" ? "default" : "ghost"}
                className="flex w-full items-center justify-start gap-2"
                size="sm"
                disabled
              >
                <SettingsIcon className="h-4 w-4" />
                Paramètres
              </Button>
            </NavigationMenuItem>
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
        />
      </div>
    </div>
  );
}
