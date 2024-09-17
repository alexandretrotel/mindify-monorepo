"use client";
import "client-only";

import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { BookIcon, GraduationCapIcon } from "lucide-react";
import Notifications from "@/components/features/notifications/Notifications";
import type { UUID } from "crypto";
import { usePathname } from "next/navigation";
import SearchBarHeader from "@/components/global/SearchBarHeader";

const links: {
  label: string;
  trigger?: boolean;
  enabled?: boolean;
  href: string;
  icon?: React.ReactNode;
  children?: {
    href: string;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[];
}[] = [
  { label: "Librairie", href: "/library", enabled: true, icon: <BookIcon className="h-4 w-4" /> },
  {
    label: "Apprendre",
    href: "/learn",
    enabled: true,
    icon: <GraduationCapIcon className="h-4 w-4" />
  }
];

const AppHeader = ({
  children,
  isNotTransparent,
  isNotFixed,
  userId,
  isConnected
}: {
  children: React.ReactNode;
  isNotTransparent?: boolean;
  isNotFixed?: boolean;
  userId: UUID;
  isConnected: boolean;
}) => {
  const pathname = usePathname();

  return (
    <header
      className={`${isNotFixed ? "relative" : "fixed"} inset-x-0 top-0 z-50 px-4 py-4 md:px-8 ${isNotTransparent ? "bg-background" : ""} flex w-full justify-center border-b border-black/10 backdrop-blur-2xl transition-colors duration-300 dark:border-white/10`}
    >
      <NavigationMenu className="flex w-full max-w-7xl items-center justify-between">
        <div className="flex w-full items-center justify-between gap-8 md:gap-32">
          <div className="hidden md:flex">
            <NavigationMenuList className="flex w-full items-center gap-8">
              {links?.map((link) => {
                if (!link.enabled) return null;

                return (
                  <NavigationMenuItem key={link.label}>
                    <Link key={link.label} href={link.href}>
                      <NavigationMenuLink
                        className={`flex items-center gap-2 text-sm font-semibold hover:text-foreground ${pathname === link.href ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </div>

          <SearchBarHeader />

          <div className="flex items-center justify-end gap-4">
            <Notifications userId={userId} isConnected={isConnected} />

            {children}
          </div>
        </div>
      </NavigationMenu>
    </header>
  );
};

export default AppHeader;
