"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { BellRingIcon, CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { AccountCategory } from "@/types/account/categories";
import { useSearchParams } from "next/navigation";

export default function Navigation() {
  const [category, setCategory] = useState<AccountCategory | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category") as AccountCategory;

    if (category) {
      setCategory(category);
    } else {
      setCategory("profile");
    }
  }, [searchParams]);

  return (
    <div className="flex h-full gap-4">
      <div className="w-1/5">
        <NavigationMenu className="w-full min-w-full justify-start">
          <NavigationMenuList className="flex w-full flex-col gap-2 space-x-0">
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
              >
                <SettingsIcon className="h-4 w-4" />
                Paramètres
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="w-full rounded-md bg-slate-200"></div>
    </div>
  );
}
