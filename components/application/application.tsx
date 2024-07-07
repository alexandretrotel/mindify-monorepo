"use client";

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
import Account from "@/components/application/account/account";
import type { AccountCategory } from "@/types/account/categories";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TypographyH2 from "@/components/typography/h2";

export default function Application({ data }: { data: { user: User } }) {
  const [category, setCategory] = useState<AccountCategory>("profile");
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <>
      <div className="md:flew-row mx-auto flex w-full max-w-7xl flex-col justify-between overflow-auto p-4 py-12 md:p-8">
        <Tabs defaultValue="summary-of-the-week" className="flex flex-col gap-4">
          <header className="flex w-full items-center justify-between">
            <TabsList className="grid grid-cols-3 md:w-1/2">
              <TabsTrigger value="summary-of-the-week">Résumé</TabsTrigger>
              <TabsTrigger value="discover">Découvrir</TabsTrigger>
              <TabsTrigger value="my-library">Ma librairie</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={data.user.user_metadata.avatar_url}
                      alt={data.user.user_metadata.name}
                    />
                    <AvatarFallback>{data.user.user_metadata.name.slice(0, 1)}</AvatarFallback>
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
                    <form method="POST" action={signOut}>
                      <button type="submit" className="flex items-center gap-2">
                        <LogOutIcon className="h-4 w-4" /> Déconnexion
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main>
            <TabsContent value="summary-of-the-week">
              <div className="flex w-full flex-col gap-4 rounded-md bg-slate-100 p-4">
                <TypographyH2>Résumé de la semaine</TypographyH2>
              </div>
            </TabsContent>
            <TabsContent value="discover">
              <div className="flex w-full flex-col gap-4 rounded-md bg-slate-100 p-4">
                <TypographyH2>Découvrir</TypographyH2>
              </div>
            </TabsContent>
            <TabsContent value="my-library">
              <div className="flex w-full flex-col gap-4 rounded-md bg-slate-100 p-4">
                <TypographyH2>Ma librairie</TypographyH2>
              </div>
            </TabsContent>
          </main>
        </Tabs>
      </div>

      <Account
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        category={category}
        setCategory={setCategory}
        data={data}
      />
    </>
  );
}
