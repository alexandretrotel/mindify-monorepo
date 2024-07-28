"use client";
import "client-only";

import React from "react";
import { signOut } from "@/actions/auth";
import {
  BellRingIcon,
  CreditCardIcon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  UserPenIcon
} from "lucide-react";
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
import type { AccountCategory } from "@/types/account";
import Account from "@/components/global/Account";
import type { UUID } from "crypto";
import type { Topics } from "@/types/topics";
import Link from "next/link";

const ClientAccountDropdown = ({
  userMetadata,
  userId,
  topics,
  userTopics
}: {
  userMetadata: UserMetadata;
  userId: UUID;
  topics: Topics;
  userTopics: Topics;
}) => {
  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [category, setCategory] = React.useState<AccountCategory>("profile");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={userMetadata?.picture} alt={userMetadata?.name} />
            <AvatarFallback>
              {userMetadata?.name ? userMetadata?.name?.charAt(0) : "J"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" className="mx-4">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href="/app" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" /> Accueil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/app/profile/${userId}`} className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" /> Mon profil
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setShowMenu(true);
              setCategory("profile");
            }}
            className="flex items-center gap-2"
          >
            <UserPenIcon className="h-4 w-4" /> Compte
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setShowMenu(true);
              setCategory("subscription");
            }}
            className="flex items-center gap-2"
            disabled
          >
            <CreditCardIcon className="h-4 w-4" /> Abonnement
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setShowMenu(true);
              setCategory("notifications");
            }}
            className="flex items-center gap-2"
            disabled
          >
            <BellRingIcon className="h-4 w-4" /> Notifications
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setShowMenu(true);
              setCategory("settings");
            }}
            className="flex items-center gap-2"
            disabled
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

export default ClientAccountDropdown;
