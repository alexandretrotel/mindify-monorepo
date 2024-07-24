"use client";
import "client-only";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/actions/auth";
import { BellRingIcon, CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import Account from "@/components/application/account";
import type { AccountCategory } from "@/types/account/categories";
import { useState } from "react";
import type { UserMetadata } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Library from "@/components/application/tabs/library";
import type { Topics, UserTopics } from "@/types/topics/topics";
import { UUID } from "crypto";
import Discover from "@/components/application/tabs/discover";

export default function Application({
  children,
  userId,
  userMetadata,
  topics,
  userTopics
}: Readonly<{
  children: React.ReactNode;
  userId: UUID;
  userMetadata: UserMetadata;
  topics: Topics;
  userTopics: UserTopics;
}>) {
  const [category, setCategory] = useState<AccountCategory>("profile");
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <>
      <div className="md:flew-row mx-auto flex w-full max-w-7xl flex-col justify-between p-4 py-12 md:p-8">
        <Tabs defaultValue="discover" className="flex flex-col gap-6 md:gap-12">
          <header className="flex w-full items-center justify-between">
            <TabsList className="grid grid-cols-2 md:w-1/2">
              <TabsTrigger value="discover">Découvrir</TabsTrigger>
              <TabsTrigger value="my-library">Librairie</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={userMetadata.avatar_url} alt={userMetadata.name} />
                    <AvatarFallback>{userMetadata.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="bottom" className="mx-4">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setShowMenu(true);
                      setCategory("profile");
                    }}
                    className="flex items-center gap-2"
                  >
                    <UserIcon className="h-4 w-4" /> Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setShowMenu(true);
                      setCategory("subscription");
                    }}
                    className="flex items-center gap-2"
                  >
                    <CreditCardIcon className="h-4 w-4" /> Abonnement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setShowMenu(true);
                      setCategory("notifications");
                    }}
                    className="flex items-center gap-2"
                  >
                    <BellRingIcon className="h-4 w-4" /> Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setShowMenu(true);
                      setCategory("settings");
                    }}
                    className="flex items-center gap-2"
                  >
                    <SettingsIcon className="h-4 w-4" /> Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      onClick={async () => {
                        await signOut();
                      }}
                      type="submit"
                      className="flex items-center gap-2"
                    >
                      <LogOutIcon className="h-4 w-4" /> Déconnexion
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main>
            <TabsContent value="discover">
              <Discover topics={topics} userTopics={userTopics} />
            </TabsContent>

            <TabsContent value="my-library">
              <Library topics={topics} />
            </TabsContent>
            {children}
          </main>
        </Tabs>
      </div>

      <Account
        userId={userId}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        category={category}
        setCategory={setCategory}
        userMetadata={userMetadata}
        topics={topics}
        userTopics={userTopics}
      />
    </>
  );
}
