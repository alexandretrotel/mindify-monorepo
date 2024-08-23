"use client";
import "client-only";

import React from "react";
import { signOut } from "@/actions/auth";
import {
  BellRingIcon,
  CreditCardIcon,
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
import type { UUID } from "crypto";
import Link from "next/link";

const AccountDropdownClient = ({
  userMetadata,
  userId,
  userPicture
}: {
  userMetadata: UserMetadata;
  userId: UUID;
  userPicture: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={userPicture} alt={userMetadata?.name} />
          <AvatarFallback>
            {userMetadata?.name ? userMetadata?.name?.charAt(0) : "J"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" className="mx-4">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href={`/app/profile/${userId}`} className="flex w-full items-center gap-2">
            <UserIcon className="h-4 w-4" /> Mon profil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuItem className="flex items-center gap-2">
          <Link href={`/app/my-account?tab=profile`} className="flex w-full items-center gap-2">
            <UserPenIcon className="h-4 w-4" /> Compte
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" disabled>
          <Link
            href={`/app/my-account?tab=subscription`}
            className="flex w-full items-center gap-2"
          >
            <CreditCardIcon className="h-4 w-4" /> Abonnement
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" disabled>
          <Link
            href={`/app/my-account?tab=notifications`}
            className="flex w-full items-center gap-2"
          >
            <BellRingIcon className="h-4 w-4" /> Notifications
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" disabled>
          <Link href={`/app/my-account?tab=settings`} className="flex w-full items-center gap-2">
            <SettingsIcon className="h-4 w-4" /> Paramètres
          </Link>
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
  );
};

export default AccountDropdownClient;
