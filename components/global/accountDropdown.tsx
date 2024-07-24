"use client";
import "client-only";

import React from "react";
import { signOut } from "@/actions/auth";
import { BellRingIcon, CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserMetadata } from "@supabase/supabase-js";
import type { AccountCategory } from "@/types/account/categories";
import Account from "@/components/global/account";
import type { UUID } from "crypto";
import type { Topics, UserTopics } from "@/types/topics/topics";

const AccountDropdown = ({
  userMetadata,
  userId,
  topics,
  userTopics
}: {
  userMetadata: UserMetadata;
  userId: UUID;
  topics: Topics;
  userTopics: UserTopics;
}) => {
  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [category, setCategory] = React.useState<AccountCategory>("profile");

  return (
    <>
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
};

export default AccountDropdown;
